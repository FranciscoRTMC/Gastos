import { useCallback, useEffect, useState } from 'react'
import type { Expense, ExpenseInput } from './types'

const STORAGE_KEY = 'gastos.v1'

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export function isExpense(x: unknown): x is Expense {
  if (!x || typeof x !== 'object') return false
  const e = x as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.amount === 'number' &&
    Number.isFinite(e.amount) &&
    typeof e.category === 'string' &&
    typeof e.note === 'string' &&
    typeof e.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.date) &&
    typeof e.createdAt === 'number'
  )
}

function load(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data.filter(isExpense) : []
  } catch {
    return []
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const add = useCallback((input: ExpenseInput) => {
    setExpenses((prev) => [...prev, { ...input, id: newId(), createdAt: Date.now() }])
  }, [])

  const update = useCallback((id: string, input: ExpenseInput) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...input } : e)))
  }, [])

  const remove = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const merge = useCallback(
    (incoming: Expense[]) => {
      const ids = new Set(expenses.map((e) => e.id))
      const fresh = incoming.filter((e) => !ids.has(e.id))
      if (fresh.length) setExpenses([...expenses, ...fresh])
      return fresh.length
    },
    [expenses],
  )

  return { expenses, add, update, remove, merge }
}
