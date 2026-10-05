export type Expense = {
  id: string
  amount: number
  category: string
  note: string
  date: string
  createdAt: number
}

export type ExpenseInput = Omit<Expense, 'id' | 'createdAt'>

export type Category = { id: string; label: string; color: string }

export const CATEGORIES: Category[] = [
  { id: 'comida', label: 'Comida', color: '#4c8dff' },
  { id: 'transporte', label: 'Transporte', color: '#38bdf8' },
  { id: 'hogar', label: 'Hogar', color: '#818cf8' },
  { id: 'servicios', label: 'Servicios', color: '#22d3ee' },
  { id: 'salud', label: 'Salud', color: '#5eead4' },
  { id: 'ocio', label: 'Ocio', color: '#a5b4fc' },
  { id: 'compras', label: 'Compras', color: '#7dd3fc' },
  { id: 'otros', label: 'Otros', color: '#94a3b8' },
]

export const categoryById = (id: string): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]

export type View = 'day' | 'week' | 'month'
