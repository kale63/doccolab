import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { stringToColor } from '../lib/colors'

interface Message {
  id: string
  content: string
  user_email: string
  color: string
  created_at: string
}

export default function LiveChat({ documentId, user }: { documentId: string, user: User | null }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Cargar mensajes viejos
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
    }
    fetchMessages()

    // 2. Suscribirse a NUEVOS mensajes (Tiempo Real)
    const channel = supabase
      .channel(`chat-${documentId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `document_id=eq.${documentId}` }, 
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [documentId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    await supabase.from('messages').insert({
      document_id: documentId,
      user_email: user.email,
      content: newMessage,
      color: stringToColor(user.email || 'anon')
    })

    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white shadow-sm w-80">
      <div className="p-3 border-b bg-gray-50 font-bold text-gray-700">
        💬 Chat del Doc
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
            const isMe = msg.user_email === user?.email
            return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-gray-400 mb-1 px-1">{msg.user_email.split('@')[0]}</span>
                    <div 
                        className={`p-2 rounded-lg text-sm max-w-[90%] break-words ${isMe ? 'text-white' : 'text-gray-800'}`}
                        style={{ backgroundColor: isMe ? msg.color : '#f3f4f6' }}
                    >
                        {msg.content}
                    </div>
                </div>
            )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
          placeholder="Escribe algo..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
          ➤
        </button>
      </form>
    </div>
  )
}