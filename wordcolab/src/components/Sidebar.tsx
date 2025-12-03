import { useState } from 'react'
import { Editor } from '@tiptap/react'
import type { User } from '@supabase/supabase-js'
import LiveChat from './LiveChat'
import CollaboratorList from './CollaboratorList'
import { Users, MessageSquare } from 'lucide-react'

interface SidebarProps {
  editor: Editor | null
  documentId: string
  user: User | null
  // Esta es la nueva prop clave: recibimos la lista ya cocinada desde TiptapEditor
  onlineUsers?: any[] 
}

export default function Sidebar({ editor, documentId, user, onlineUsers = [] }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'collabs' | 'chat'>('collabs')

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full bg-white shrink-0">
      
      {/* Pestañas Superiores */}
      <div className="flex border-b bg-gray-50">
        <button
          onClick={() => setActiveTab('collabs')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition ${
            activeTab === 'collabs' 
              ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} />
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition ${
            activeTab === 'chat' 
              ? 'bg-white border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={16} />
          Chat
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'collabs' ? (
          // Pasamos la lista limpia a CollaboratorList
          <CollaboratorList users={onlineUsers} />
        ) : (
          <div className="h-full flex flex-col">
             <LiveChat documentId={documentId} user={user} />
          </div>
        )}
      </div>
    </div>
  )
}