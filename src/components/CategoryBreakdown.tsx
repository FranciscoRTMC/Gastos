import { formatARS } from '../lib/format'
import { categoryById, type Expense } from '../lib/types'

export function CategoryBreakdown({ expenses, total }: { expenses: Expense[]; total: number }) {
  const sums = new Map<string, number>()
  for (const e of expenses) sums.set(e.category, (sums.get(e.category) ?? 0) + e.amount)
  const rows = [...sums.entries()].sort((a, b) => b[1] - a[1])

  if (!rows.length) return null

  return (
    <ul className="space-y-3">
      {rows.map(([id, sum]) => {
        const c = categoryById(id)
        const pct = total ? (sum / total) * 100 : 0
        return (
          <li key={id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-navy-100">
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                {c.label}
              </span>
              <span className="tabular-nums text-navy-300">
                {formatARS(sum)} <span className="ml-1 text-xs text-navy-400">{pct.toFixed(0)}%</span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-navy-800">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
