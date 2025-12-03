import { stringToColor } from '../lib/colors'

export default function CollaboratorList({ users }: { users: any[] }) {
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wide">
          En línea ({users.length})
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {users.map((u: any, i: number) => {
          const email = u.user_email || 'Anónimo'
          const name = email.split('@')[0]
          const color = stringToColor(email)
          
          return (
            <div key={i} className="flex items-center justify-between group animate-fade-in">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm relative transition transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  title={email}
                >
                  {name[0].toUpperCase()}
                  {/* Puntito verde de estado */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                
                {/* Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    {name}
                  </span>
                  <span className="text-[10px] text-green-600 font-medium">
                    Conectado
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Estado vacío */}
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 opacity-60">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">😴</span>
             </div>
             <p className="text-sm text-gray-500">Esperando compañeros...</p>
          </div>
        )}
      </div>
    </div>
  )
}