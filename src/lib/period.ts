import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { capitalize as cap } from './format'
import type { View } from './types'

export type Period = { start: Date; end: Date }

const WEEK = { weekStartsOn: 1 } as const

export function getPeriod(view: View, anchor: Date): Period {
  if (view === 'day') return { start: startOfDay(anchor), end: endOfDay(anchor) }
  if (view === 'week') return { start: startOfWeek(anchor, WEEK), end: endOfWeek(anchor, WEEK) }
  return { start: startOfMonth(anchor), end: endOfMonth(anchor) }
}

export function shiftAnchor(view: View, anchor: Date, step: number): Date {
  if (view === 'day') return addDays(anchor, step)
  if (view === 'week') return addWeeks(anchor, step)
  return addMonths(anchor, step)
}

export function periodLabel(view: View, { start, end }: Period): string {
  if (view === 'day') return cap(format(start, "EEEE d 'de' MMMM", { locale: es }))
  if (view === 'month') return cap(format(start, 'MMMM yyyy', { locale: es }))
  const startFmt = isSameMonth(start, end) ? 'd' : isSameYear(start, end) ? 'd MMM' : 'd MMM yyyy'
  return `${format(start, startFmt, { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`
}

export function elapsedDays({ start, end }: Period, today = new Date()): number {
  const last = today < end ? today : end
  const days = differenceInCalendarDays(last, start) + 1
  return days > 0 ? days : differenceInCalendarDays(end, start) + 1
}
