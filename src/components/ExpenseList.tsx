import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { capitalize, formatARS } from '../lib/format'
import { categoryById, type Expense } from '../lib/types'

type Props = {
  expenses: Expense[]
  editingId: string | null
  onEdit: (e: Expense) => void
  onDelete: (e: Expense) => void
}

export function ExpenseList({ expenses, editingId, onEdit, onDelete }: Props) {
  if (!expenses.length) {
    return <p className="py-10 text-center text-sm text-navy-400">No hay gastos en este período.</p>
  }

  const groups = new Map<string, Expense[]>()
  for (const e of expenses) groups.set(e.date, [...(groups.get(e.date) ?? []), e])

  return (
    <div className="space-y-5">
      {[...groups.entries()].map(([date, items]) => (
        <section key={date}>
          <header className="mb-2 flex items-center justify-between text-xs text-navy-400">
            <span>{capitalize(format(parseISO(date), "EEEE d 'de' MMMM", { locale: es }))}</span>
            <span className="tabular-nums">{formatARS(items.reduce((s, e) => s + e.amount, 0))}</span>
          </header>
          <ul className="divide-y divide-navy-800 rounded-xl border border-navy-800 bg-navy-900">
            {items.map((e) => {
              const c = categoryById(e.category)
              return (
                <li
                  key={e.id}
                  className={`group flex items-center gap-3 px-4 py-3 ${editingId === e.id ? 'bg-accent/10' : ''}`}
                >
                  <span className="h-8 w-1 rounded-full" style={{ background: c.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-navy-100">{e.note || c.label}</p>
                    {e.note && <p className="text-xs text-navy-400">{c.label}</p>}
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatARS(e.amount)}</span>
                  <div className="flex gap-1 opacity-60 transition group-hover:opacity-100">
                    <IconButton label="Editar" onClick={() => onEdit(e)}>
                      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
                    </IconButton>
                    <IconButton label="Eliminar" onClick={() => onDelete(e)} danger>
                      <path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </IconButton>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function IconButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`rounded-md p-1.5 text-navy-400 transition hover:bg-navy-800 ${
        danger ? 'hover:text-rose-300' : 'hover:text-navy-100'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}
