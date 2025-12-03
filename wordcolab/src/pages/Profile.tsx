import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { stringToColor } from '../lib/colors'
import { User, Lock, Save, ArrowLeft, LogOut } from 'lucide-react'

export default function Profile({ session }: { session: Session }) {
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (session.user.user_metadata?.full_name) {
      setFullName(session.user.user_metadata.full_name)
    }
  }, [session])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. Actualizar Nombre
    const { error: nameError } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })

    // 2. Actualizar Contraseña
    let passMsg = ''
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password: password })
      if (passError) alert('Error password: ' + passError.message)
      else passMsg = ' y contraseña'
    }

    if (nameError) alert('Error: ' + nameError.message)
    else {
        alert(`Perfil${passMsg} actualizado correctamente`)
        setPassword('')
    }
    setLoading(false)
  }

  const userColor = stringToColor(session.user.email || 'anon')
  const displayName = fullName || session.user.email?.split('@')[0]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header con color */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <button onClick={() => navigate('/')} className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium transition">
                <ArrowLeft size={16} /> Volver
            </button>
        </div>

        {/* Avatar Flotante */}
        <div className="relative px-8">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl text-white font-bold" style={{backgroundColor: userColor}}>
                    {displayName?.[0].toUpperCase()}
                </div>
            </div>
        </div>

        <div className="pt-16 pb-8 px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>

        {/* Formulario */}
        <div className="px-8 pb-8">
            <form onSubmit={updateProfile} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Nombre para mostrar</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                            placeholder="Ej: Juan Pérez"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Cambiar Contraseña</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                            placeholder="Nueva contraseña (opcional)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                        />
                    </div>
                </div>

                <button disabled={loading} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all active:scale-95">
                    <Save size={18} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                    onClick={() => supabase.auth.signOut()} 
                    className="w-full flex justify-center items-center gap-2 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}