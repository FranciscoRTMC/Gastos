import { useState, type FormEvent } from 'react'
import { parseAmount, toISODate } from '../lib/format'
import { CATEGORIES, type Expense, type ExpenseInput } from '../lib/types'

type Props = {
  editing: Expense | null
  onSubmit: (input: ExpenseInput) => void
  onCancel: () => void
}

export function ExpenseForm({ editing, onSubmit, onCancel }: Props) {
  const [amount, setAmount] = useState(editing ? String(editing.amount).replace('.', ',') : '')
  const [category, setCategory] = useState(editing?.category ?? CATEGORIES[0].id)
  const [note, setNote] = useState(editing?.note ?? '')
  const [date, setDate] = useState(() => editing?.date ?? toISODate(new Date()))
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = parseAmount(amount)
    if (value === null) {
      setError('Ingresá un monto válido')
      return
    }
    onSubmit({ amount: value, category, note: note.trim(), date })
    if (!editing) {
      setAmount('')
      setNote('')
    }
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-700/60 bg-navy-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-wide text-navy-300 uppercase">
          {editing ? 'Editar gasto' : 'Nuevo gasto'}
        </h2>
        {editing && (
          <button type="button" onClick={onCancel} className="text-xs text-navy-300 hover:text-navy-100">
            Cancelar
          </button>
        )}
      </div>

      <label className="block">
        <span className="sr-only">Monto</span>
        <div className="flex items-baseline gap-2 border-b border-navy-700 pb-2 focus-within:border-accent">
          <span className="text-2xl text-navy-400">$</span>
          <input
            autoFocus
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-semibold tabular-nums outline-none placeholder:text-navy-700"
          />
          <span className="text-xs text-navy-400">ARS</span>
        </div>
      </label>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
              category === c.id
                ? 'border-accent bg-accent/15 text-navy-100'
                : 'border-navy-700 text-navy-300 hover:border-navy-600 hover:text-navy-100'
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,9.5rem)]">
        <input
          placeholder="Nota (opcional)"
          value={note}
          maxLength={120}
          onChange={(e) => setNote(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-navy-700 bg-navy-850 px-3 py-2 text-sm outline-none placeholder:text-navy-400 focus:border-accent"
        />
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full min-w-0 rounded-lg border border-navy-700 bg-navy-850 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent-strong"
      >
        {editing ? 'Guardar cambios' : 'Agregar gasto'}
      </button>
    </form>
  )
}
