import { useEffect, useState } from 'react'

export function useToday(): Date {
  const [today, setToday] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setToday(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  return today
}
