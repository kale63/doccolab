import { Editor } from '@tiptap/react'
import { 
  Bold, Italic, Strikethrough, List, ListOrdered, 
  Heading1, Heading2, Undo, Redo, Quote, Table as TableIcon, Undo2, Redo2, 
} from 'lucide-react'

interface ToolbarProps {
  editor: Editor | null
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  const btnClass = (isActive: boolean) => 
    `p-2 rounded hover:bg-gray-200 transition ${isActive ? 'bg-gray-200 text-black' : 'text-gray-500'}`

  return (
    <div className="flex items-center gap-1 border-b p-2 bg-white sticky top-0 z-10 shadow-sm shrink-0">
      
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrita">
        <Bold size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Cursiva">
        <Italic size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Tachado">
        <Strikethrough size={18} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>
        <Heading1 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
        <Heading2 size={18} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
        <List size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
        <ListOrdered size={18} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>
        <Quote size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={btnClass(editor.isActive('table'))} 
        title="Insertar Tabla (3x3)"
      >
        <TableIcon size={18} />
      </button>

      <div className="flex-1"></div>

      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Deshacer">
        <Undo2 size={18} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Rehacer">
        <Redo2 size={18} />
      </button>
      
      <div className="flex-1"></div>

      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)}>
        <Undo size={18} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)}>
        <Redo size={18} />
      </button>
    </div>
  )
}