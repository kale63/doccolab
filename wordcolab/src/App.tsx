import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient.ts'
import type { Session } from '@supabase/supabase-js'
import Auth from './components/Auth.tsx'
import Dashboard from './pages/Dashboard.tsx'
import DocumentPage from './pages/DocumentPage'
import Profile from './pages/Profile.tsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // 1. sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="p-10">Cargando aplicación...</div>

  return (
    <BrowserRouter>
      {!session ? (
        <Auth />
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard session={session} />} />
          <Route path="/doc/:id" element={<DocumentPage session={session} />} />
          <Route path="/profile" element={<Profile session={session} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App