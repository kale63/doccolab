import { useEffect, useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import ShareModal from './ShareModal'

import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'

interface EditorProps {
  documentId: string;
  user: User | null;
}

const TiptapEditor = ({ documentId, user }: EditorProps) => {
  const [title, setTitle] = useState('Cargando...')
  const [status, setStatus] = useState('En línea')
  const [lastModified, setLastModified] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [showShareModal, setShowShareModal] = useState(false) 
  const lastContentRef = useRef<string>('') 

  // 1. CONFIGURACIÓN DEL EDITOR
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: true }), 
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
    },
    onUpdate: ({ editor }) => {
       lastContentRef.current = JSON.stringify(editor.getJSON())
    }
  })

  // 2. CARGA INICIAL
  useEffect(() => {
    const init = async () => {
      const { data: docData } = await supabase.from('documents').select('title, content, updated_at').eq('id', documentId).single()
      if (docData) {
        setTitle(docData.title || 'Sin título')
        if (docData.updated_at) setLastModified(docData.updated_at)

        if (docData.content && editor && editor.isEmpty) {
           editor.commands.setContent(docData.content)
           lastContentRef.current = JSON.stringify(docData.content)
        }
      }
    }
    init()
  }, [documentId, editor])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('print') === 'true') {
      const timer = setTimeout(() => {
        window.print()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  // 3. SINCRONIZACIÓN DE TEXTO (POLLING CADA 2 SEGUNDOS)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!editor) return

      // A) SUBIDA
      const currentContentStr = JSON.stringify(editor.getJSON())
      if (currentContentStr !== lastContentRef.current && editor.isFocused) {
        setStatus('Guardando...')
        const now = new Date().toISOString()
        await supabase.from('documents').update({ content: editor.getJSON(), updated_at: now }).eq('id', documentId)
        lastContentRef.current = currentContentStr
        setLastModified(now)
        setStatus('Guardado')
        setTimeout(() => setStatus('En línea'), 1000)
      }

      // B) BAJADA
      if (!editor.isFocused) {
        const { data } = await supabase.from('documents').select('content, updated_at').eq('id', documentId).single()
        const cloudContentStr = JSON.stringify(data?.content)
        
        if (data?.content && cloudContentStr !== currentContentStr && cloudContentStr !== lastContentRef.current) {
           const { from, to } = editor.state.selection 
           editor.commands.setContent(data.content)
           editor.commands.setTextSelection({ from, to }) 
           lastContentRef.current = cloudContentStr
           if(data.updated_at) setLastModified(data.updated_at)
           setStatus('Sincronizado')
           setTimeout(() => setStatus('En línea'), 1000)
        }
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [documentId, editor])


  // 4. LISTA DE USUARIOS (Usando Presence del canal)
  useEffect(() => {
    if (!user) return

    const room = supabase.channel(`presence-${documentId}`)
    
    room
      .on('presence', { event: 'sync' }, () => {
        const newState = room.presenceState()
        const users = Object.values(newState).flat()
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await room.track({
            user_email: user.email,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => { room.unsubscribe() }
  }, [documentId, user])


  // Funciones UI
  const handleTitleUpdate = async () => {
    await supabase.from('documents').update({ title }).eq('id', documentId)
  }
  const saveManually = async () => {
    if (!editor) return
    const now = new Date().toISOString()
    await supabase.from('documents').update({ content: editor.getJSON(), updated_at: now }).eq('id', documentId)
    setLastModified(now)
    alert('¡Guardado!')
  }
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado al portapapeles')
  }

  if (!editor) return <div className="flex items-center justify-center h-screen text-gray-400 bg-gray-50">Cargando documento...</div>

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="h-[60px] bg-white border-b flex items-center justify-between px-6 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-4">
            <a href="/" className="bg-blue-600 w-8 h-8 flex items-center justify-center rounded text-white font-bold hover:bg-blue-700 transition">
                W
            </a>
          <div className="flex flex-col">
             <input 
               className="font-semibold text-gray-800 text-sm outline-none bg-transparent placeholder-gray-400 focus:ring-2 ring-blue-100 rounded px-1 -ml-1 transition"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               onBlur={handleTitleUpdate}
             />
             <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${status === 'En línea' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <p>{status}</p>
                </div>
                {lastModified && (
                    <>
                        <span>•</span>
                        <p>Editado {formatDistanceToNow(new Date(lastModified), { addSuffix: true, locale: es })}</p>
                    </>
                )}
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setShowShareModal(true)} className="text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded text-sm border border-gray-200 transition-colors">
            🔗 Compartir
          </button>
          <button onClick={saveManually} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
            Guardar
          </button>
          <a href="/profile" className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs text-indigo-700 font-bold ml-2 hover:ring-2 ring-indigo-300 transition" title="Ir a mi perfil">
             {user?.email?.[0].toUpperCase()}
          </a>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 bg-gray-100 relative">
          <Toolbar editor={editor} />
          <div className="flex-1 overflow-y-auto p-4 md:p-8 cursor-text" onClick={() => editor.chain().focus().run()}>
            <div className="max-w-[850px] mx-auto bg-white min-h-[900px] shadow-md border border-gray-200 p-8 md:p-[96px] rounded-sm">
               <EditorContent editor={editor} />
            </div>
            <div className="h-20"></div>
          </div>
        </div>
        
        <Sidebar editor={null} documentId={documentId} user={user} onlineUsers={onlineUsers} />
      
        <ShareModal 
           documentId={documentId} 
           isOpen={showShareModal} 
           onClose={() => setShowShareModal(false)} 
        />
      </div>
    </div>
  )
}

export default TiptapEditor