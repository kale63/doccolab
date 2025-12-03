import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
// Importamos la nueva Navbar y los íconos necesarios
import Navbar from '../components/Navbar'
import { Plus, FileText, MoreVertical, Trash2, ExternalLink, Clock, User as UserIcon, Users, Printer } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { stringToColor } from '../lib/colors'

interface Document {
  id: string
  title: string
  created_at: string
  updated_at: string
  owner_email?: string
}

export default function Dashboard({ session }: { session: Session }) {
  const [myDocuments, setMyDocuments] = useState<Document[]>([])
  const [sharedDocuments, setSharedDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null)
  const navigate = useNavigate()
  const userEmail = session.user.email

  useEffect(() => {
    fetchDocuments()
  }, [])

  // (La función fetchDocuments es igual que antes...)
  const fetchDocuments = async () => {
    setLoading(true)
    if (!userEmail) return

    // 1. Mis Documentos
    const { data: myDocs, error: myError } = await supabase
      .from('documents')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('updated_at', { ascending: false })

    if (myError) console.error('Error fetching my docs:', myError)
    else setMyDocuments(myDocs || [])

    // 2. Documentos Compartidos Conmigo
    const { data: sharedPermissions, error: sharedError } = await supabase
        .from('document_permissions')
        .select(`
            document_id,
            documents:document_id ( id, title, created_at, updated_at, owner_id )
        `)
        .eq('user_email', userEmail)

    if (sharedError) {
        console.error(sharedError)
    } else {
        const formattedSharedDocs = sharedPermissions.map((item: any) => ({
            ...item.documents,
            // Ahora sí leemos el email real si existe, si no "Propietario"
            owner_email: item.documents.owner_email || 'Propietario' 
        })).filter((doc:any) => doc && doc.id);
        setSharedDocuments(formattedSharedDocs)
    }
    setLoading(false)
  }

  const createDocument = async () => {
    const { data, error } = await supabase
      .from('documents')
      .insert([{ 
          title: 'Nuevo Documento', 
          content: {}, 
          owner_id: session.user.id,
          owner_email: session.user.email, // <--- GUARDAMOS EL EMAIL AQUÍ
          updated_at: new Date().toISOString() 
      }])
      .select()
      .single()

    if (error) alert('Error al crear documento')
    else if (data) navigate(`/doc/${data.id}`)
  }

  // 2. FUNCIÓN PARA "EXPORTAR" (IMPRIMIR)
  const printDocument = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // AHORA AGREGAMOS ?print=true AL LINK
    window.open(`/doc/${docId}?print=true`, '_blank')
    setActiveMenuDocId(null)
  }

  const deleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) return
    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) alert('Error al eliminar: ' + error.message)
    else { fetchDocuments(); setActiveMenuDocId(null) }
  }

  const toggleMenu = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveMenuDocId(activeMenuDocId === docId ? null : docId)
  }

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuDocId(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])


  // Componente de Tarjeta (Igual que antes)
  const DocumentCard = ({ doc, isShared = false }: { doc: Document, isShared?: boolean }) => {
    const ownerName = isShared ? (doc.owner_email?.split('@')[0] || 'Propietario') : 'Mí'
    const ownerColor = stringToColor(doc.owner_email || session.user.id)
    const dateToUse = doc.updated_at || doc.created_at;

    return (
        <div 
            className="bg-white border border-gray-200/80 rounded-xl p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-blue-200/50 transition-all cursor-pointer group relative flex flex-col justify-between min-h-[170px]"
            onClick={() => navigate(`/doc/${doc.id}`)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-sm ${isShared ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        <FileText size={22} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1 text-[17px] leading-tight" title={doc.title}>{doc.title}</h3>
                        {isShared && <p className="text-xs text-purple-600 font-medium mt-0.5">Compartido contigo</p>}
                    </div>
                </div>
                
                {!isShared && (
                    <div className="relative">
                        <button 
                            onClick={(e) => toggleMenu(doc.id, e)}
                            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <MoreVertical size={18} />
                        </button>
                        {activeMenuDocId === doc.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 py-1.5 overflow-hidden ring-1 ring-black ring-opacity-5">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate(`/doc/${doc.id}`) }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                >
                                    <ExternalLink size={16} className="text-gray-500" /> Abrir
                                </button>
                                <button 
                                    onClick={(e) => printDocument(doc.id, e)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                >
                                    <Printer size={16} className="text-gray-500" /> Imprimir / PDF
                                </button>
                                <div className="my-1 border-b border-gray-100"></div>
                                <button 
                                    onClick={(e) => deleteDocument(doc.id, e)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-dashed border-gray-100">
                <div className="flex items-center gap-2">
                    {isShared ? (
                         <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm" style={{ backgroundColor: ownerColor }}>
                             {ownerName[0].toUpperCase()}
                         </div>
                    ) : (
                        <UserIcon size={15} className="text-gray-400"/>
                    )}
                    <span className="font-medium text-gray-600">{ownerName}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 px-2 py-1 rounded-full" title={new Date(dateToUse).toLocaleString()}>
                    <Clock size={13} className="text-gray-400" />
                    {formatDistanceToNow(new Date(dateToUse), { addSuffix: true, locale: es })}
                </span>
            </div>
        </div>
    )
  }

  // --- LAYOUT PRINCIPAL ACTUALIZADO ---
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* AQUI ESTÁ LA NUEVA BARRA SUPERIOR */}
      <Navbar userEmail={userEmail} />

      {/* Contenido Principal Centrado */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de la sección */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Mis Documentos</h2>
                <p className="text-gray-500 mt-1">Gestiona y crea tus proyectos colaborativos.</p>
            </div>
             <button 
                onClick={createDocument}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
                <Plus size={20} />
                Nuevo Documento
            </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Sección 1: Mis Documentos (Grid) */}
            <section>
                {myDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myDocuments.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No tienes documentos aún.</p>
                        <button onClick={createDocument} className="text-blue-600 hover:underline text-sm mt-2">Crea el primero</button>
                    </div>
                )}
            </section>

             {/* Sección 2: Compartidos Conmigo (Separada) */}
             {sharedDocuments.length > 0 && (
                <section className="relative">
                     <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-start mb-8">
                        <span className="pr-4 bg-[#F8FAFC] text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Users size={20} className="text-purple-500"/> Compartidos Conmigo
                        </span>
                    </div>
                    
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sharedDocuments.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} isShared={true} />
                        ))}
                    </div>
                </section>
             )}
          </div>
        )}
      </main>
    </div>
  )
}