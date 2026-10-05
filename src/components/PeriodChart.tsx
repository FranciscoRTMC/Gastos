import { eachDayOfInterval, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { capitalize, formatARS, formatCompact, toISODate } from '../lib/format'
import type { Period } from '../lib/period'
import type { Expense, View } from '../lib/types'

type Props = { view: Exclude<View, 'day'>; period: Period; expenses: Expense[]; today: Date }

export function PeriodChart({ view, period, expenses, today }: Props) {
  const totals = new Map<string, number>()
  for (const e of expenses) totals.set(e.date, (totals.get(e.date) ?? 0) + e.amount)

  const todayKey = toISODate(today)
  const data = eachDayOfInterval(period).map((d) => {
    const key = toISODate(d)
    return {
      key,
      label: view === 'week' ? format(d, 'EEEEEE', { locale: es }) : format(d, 'd'),
      full: capitalize(format(d, "EEEE d 'de' MMMM", { locale: es })),
      total: totals.get(key) ?? 0,
      isToday: key === todayKey,
    }
  })

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6f88b8', fontSize: 11 }}
            interval={view === 'month' ? 'preserveStartEnd' : 0}
          />
          <YAxis
            width={48}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6f88b8', fontSize: 11 }}
            tickFormatter={(v: number) => (v ? formatCompact(v) : '')}
          />
          <Tooltip
            cursor={{ fill: 'rgba(76,141,255,0.08)' }}
            contentStyle={{
              background: '#0f2142',
              border: '1px solid #1c3766',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#9fb3d9' }}
            itemStyle={{ color: '#e6ecf5' }}
            labelFormatter={(_, payload) => payload?.[0]?.payload.full ?? ''}
            formatter={(v) => [formatARS(Number(v)), 'Total']}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((d) => (
              <Cell key={d.key} fill={d.isToday ? '#7aa7ff' : '#3577f0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
