import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { X, UserPlus, Check } from 'lucide-react'

interface ShareModalProps {
  documentId: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ documentId, isOpen, onClose }: ShareModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  if (!isOpen) return null

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!email.includes('@')) {
        setMessage({ text: 'Escribe un email válido', type: 'error' })
        setLoading(false)
        return
    }

    const { error } = await supabase
      .from('document_permissions')
      .insert({
        document_id: documentId,
        user_email: email.trim().toLowerCase(),
        permission_type: 'edit' 
      })

    setLoading(false)

    if (error) {
      if (error.code === '23505') {
        setMessage({ text: '¡Este usuario ya tiene acceso!', type: 'error' })
      } else {
        setMessage({ text: 'Error al compartir: ' + error.message, type: 'error' })
      }
    } else {
      setMessage({ text: '¡Invitación enviada correctamente!', type: 'success' })
      setEmail('')
      setTimeout(onClose, 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        
        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <UserPlus size={24} className="text-blue-600" />
            Compartir Documento
        </h2>
        <p className="text-gray-500 text-sm mb-6">
            Invita a otros usuarios a editar este documento. Aparecerá en su Dashboard.
        </p>

        <form onSubmit={handleShare} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email del usuario</label>
                <input 
                    type="email" 
                    className="w-full border p-2.5 rounded focus:ring-2 ring-blue-500 outline-none transition"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />
            </div>

            {/* Mensajes de Estado */}
            {message && (
                <div className={`p-3 rounded text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' && <Check size={16} />}
                    {message.text}
                </div>
            )}
            
            <div className="flex justify-end gap-3 pt-2">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium text-sm transition"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium text-sm transition disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? 'Enviando...' : 'Invitar'}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}