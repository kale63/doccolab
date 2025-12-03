import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LogOut, User, ChevronDown, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  userEmail?: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Lado Izquierdo: Logo y Título */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-9 h-9 flex items-center justify-center rounded-lg text-white font-bold shadow-sm">
              W
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              DocCollab
            </h1>
             {/* Navegación simple (opcional) */}
             <nav className="hidden md:flex ml-10 space-x-4">
                <Link to="/dashboard" className="text-blue-600 font-medium flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50">
                    <FileText size={18} /> Tablero
                </Link>
            </nav>
          </div>

          {/* Lado Derecho: Menú de Usuario Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border hover:shadow-sm transition-all cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-sm text-indigo-700 font-bold">
                {userEmail?.[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block truncate max-w-[150px]">
                {userEmail}
              </span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-3 border-b mb-2 md:hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">Conectado como</p>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                </div>
                
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="text-gray-500" /> Mi Perfil
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}