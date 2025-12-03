import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true) // Estado para alternar vistas

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let errorObject = null
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      errorObject = error
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      errorObject = error
    }

    if (errorObject) {
      alert(errorObject.message)
    } else if (!isLogin) {
      alert('¡Cuenta creada! Revisa tu correo o inicia sesión.')
      setIsLogin(true) // Cambiamos a login automáticamente
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* 1. Header con Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
        <div className="bg-blue-600 w-14 h-14 flex items-center justify-center rounded-2xl text-white font-bold text-3xl shadow-lg mb-4 transform -rotate-3 transition-transform hover:rotate-0">
            W
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          DocCollab
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tu espacio de trabajo colaborativo en tiempo real
        </p>
      </div>

      {/* 2. Tarjeta del Formulario */}
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                    {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta nueva'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    {isLogin ? 'Ingresa tus credenciales para acceder' : 'Empieza a colaborar gratis hoy mismo'}
                </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleAuth}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg h-11 border transition-colors"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            required
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg h-11 border transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                        <>
                            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            {/* 3. Toggle Login/Registro */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            {isLogin ? '¿Eres nuevo aquí?' : '¿Ya tienes cuenta?'}
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {isLogin ? 'Crear una cuenta gratis' : 'Inicia sesión en tu cuenta'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}