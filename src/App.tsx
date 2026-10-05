import { isWithinInterval, parseISO } from 'date-fns'
import { useMemo, useState } from 'react'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { DataMenu } from './components/DataMenu'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { PeriodChart } from './components/PeriodChart'
import { formatARS } from './lib/format'
import { elapsedDays, getPeriod, periodLabel, shiftAnchor, type Period } from './lib/period'
import type { Expense, ExpenseInput, View } from './lib/types'
import { useExpenses } from './lib/useExpenses'
import { useToday } from './lib/useToday'

const VIEWS: { id: View; label: string; summary: string }[] = [
  { id: 'day', label: 'Día', summary: 'Hoy' },
  { id: 'week', label: 'Semana', summary: 'Esta semana' },
  { id: 'month', label: 'Mes', summary: 'Este mes' },
]

const inPeriod = (expenses: Expense[], period: Period) =>
  expenses.filter((e) => isWithinInterval(parseISO(e.date), period))

const sum = (expenses: Expense[]) => expenses.reduce((s, e) => s + e.amount, 0)

export default function App() {
  const { expenses, add, update, remove, merge } = useExpenses()
  const today = useToday()
  const [view, setView] = useState<View>('month')
  const [anchor, setAnchor] = useState(() => new Date())
  const [editing, setEditing] = useState<Expense | null>(null)

  const period = useMemo(() => getPeriod(view, anchor), [view, anchor])
  const current = useMemo(
    () =>
      inPeriod(expenses, period).sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
      ),
    [expenses, period],
  )
  const total = sum(current)
  const isCurrent = isWithinInterval(today, period)

  const summaries = useMemo(() => {
    return VIEWS.map((v) => ({ ...v, total: sum(inPeriod(expenses, getPeriod(v.id, today))) }))
  }, [expenses, today])

  const handleSubmit = (input: ExpenseInput) => {
    if (editing) {
      update(editing.id, input)
      setEditing(null)
    } else {
      add(input)
    }
  }

  const handleDelete = (e: Expense) => {
    if (confirm(`¿Eliminar el gasto de ${formatARS(e.amount)}?`)) {
      remove(e.id)
      if (editing?.id === e.id) setEditing(null)
    }
  }

  const selectView = (v: View, resetToToday = false) => {
    setView(v)
    if (resetToToday) setAnchor(today)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
          <p className="text-sm text-navy-400">Registro simple de tus gastos en ARS</p>
        </div>
        <DataMenu expenses={expenses} onImport={merge} />
      </header>

      <section className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {summaries.map((s) => (
          <button
            key={s.id}
            onClick={() => selectView(s.id, true)}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition sm:block sm:p-4 ${
              view === s.id && isCurrent
                ? 'border-accent/70 bg-navy-850'
                : 'border-navy-800 bg-navy-900 hover:border-navy-700'
            }`}
          >
            <p className="text-xs text-navy-400">{s.summary}</p>
            <p className="truncate text-lg font-semibold tabular-nums sm:mt-1 sm:text-2xl">{formatARS(s.total)}</p>
          </button>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <ExpenseForm
            key={editing?.id ?? 'new'}
            editing={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
          {current.length > 0 && (
            <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
              <h2 className="mb-4 text-sm font-medium tracking-wide text-navy-300 uppercase">Por categoría</h2>
              <CategoryBreakdown expenses={current} total={total} />
            </div>
          )}
        </aside>

        <main className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-lg bg-navy-850 p-1">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => selectView(v.id)}
                    className={`rounded-md px-3 py-1 text-sm transition ${
                      view === v.id ? 'bg-navy-700 text-navy-100' : 'text-navy-400 hover:text-navy-100'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <NavButton label="Anterior" onClick={() => setAnchor(shiftAnchor(view, anchor, -1))} d="M15 6l-6 6 6 6" />
                <button
                  onClick={() => setAnchor(today)}
                  disabled={isCurrent}
                  className="rounded-md px-2 py-1 text-xs text-navy-300 hover:bg-navy-800 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  Hoy
                </button>
                <NavButton label="Siguiente" onClick={() => setAnchor(shiftAnchor(view, anchor, 1))} d="M9 6l6 6-6 6" />
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-sm text-navy-400">{periodLabel(view, period)}</p>
                <p className="text-3xl font-semibold tabular-nums">{formatARS(total)}</p>
              </div>
              <div className="flex gap-6 text-right text-xs text-navy-400">
                <div>
                  <p>Movimientos</p>
                  <p className="text-sm text-navy-100 tabular-nums">{current.length}</p>
                </div>
                {view !== 'day' && (
                  <div>
                    <p>Promedio diario</p>
                    <p className="text-sm text-navy-100 tabular-nums">{formatARS(total / elapsedDays(period, today))}</p>
                  </div>
                )}
              </div>
            </div>

            {view !== 'day' && <PeriodChart view={view} period={period} expenses={current} today={today} />}
          </div>

          <ExpenseList
            expenses={current}
            editingId={editing?.id ?? null}
            onEdit={(e) => {
              setEditing(e)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onDelete={handleDelete}
          />
        </main>
      </div>

      <footer className="mt-12 text-center text-xs text-navy-600">
        Los datos se guardan solo en este navegador. Exportá un respaldo de vez en cuando.
      </footer>
    </div>
  )
}

function NavButton({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-navy-300 transition hover:bg-navy-800 hover:text-navy-100"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </button>
  )
}
