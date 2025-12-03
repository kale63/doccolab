import { useParams } from 'react-router-dom'
import TiptapEditor from '../components/TiptapEditor'
import type { Session } from '@supabase/supabase-js'

interface DocumentPageProps {
  session: Session;
}

export default function DocumentPage({ session }: DocumentPageProps) {
  const { id } = useParams<{ id: string }>()

  if (!id) return <div>Error: ID no válido</div>

  // Quitamos todos los divs extra, el Editor se encarga del layout completo
  return <TiptapEditor documentId={id} user={session.user} />
}