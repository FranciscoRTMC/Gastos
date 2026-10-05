import { format } from 'date-fns'

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compact = new Intl.NumberFormat('es-AR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatARS = (n: number) => currency.format(n)
export const formatCompact = (n: number) => `$${compact.format(n)}`

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const toISODate = (d: Date) => format(d, 'yyyy-MM-dd')

export function parseAmount(raw: string): number | null {
  let s = raw.trim().replace(/\s|\$/g, '')
  if (!s) return null
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '')
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null
}
