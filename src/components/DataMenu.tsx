import { useRef } from 'react'
import { toISODate } from '../lib/format'
import { categoryById, type Expense } from '../lib/types'
import { isExpense } from '../lib/useExpenses'

type Props = { expenses: Expense[]; onImport: (items: Expense[]) => number }

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

const csvCell = (v: string) => (/[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

export function DataMenu({ expenses, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)

  const exportJSON = () =>
    download(`gastos-${toISODate(new Date())}.json`, JSON.stringify(sorted, null, 2), 'application/json')

  const exportCSV = () => {
    const rows = sorted.map((e) =>
      [e.date, categoryById(e.category).label, e.amount.toFixed(2).replace('.', ','), e.note]
        .map(csvCell)
        .join(';'),
    )
    download(`gastos-${toISODate(new Date())}.csv`, '\uFEFF' + ['Fecha;Categoría;Monto (ARS);Nota', ...rows].join('\n'), 'text/csv')
  }

  const handleFile = async (file: File) => {
    try {
      const data: unknown = JSON.parse(await file.text())
      if (!Array.isArray(data)) throw new Error()
      const valid = data.filter(isExpense)
      const added = onImport(valid)
      alert(`Importados ${added} gastos nuevos${valid.length - added ? ` (${valid.length - added} ya existían)` : ''}.`)
    } catch {
      alert('El archivo no es un respaldo válido.')
    }
  }

  const btn = 'rounded-md px-2.5 py-1.5 text-xs text-navy-300 transition hover:bg-navy-800 hover:text-navy-100'

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button className={btn} onClick={exportJSON} disabled={!expenses.length}>
        Exportar JSON
      </button>
      <button className={btn} onClick={exportCSV} disabled={!expenses.length}>
        Exportar CSV
      </button>
      <button className={btn} onClick={() => fileRef.current?.click()}>
        Importar
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
