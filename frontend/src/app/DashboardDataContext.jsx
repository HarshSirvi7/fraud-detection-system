import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../services/api.js'

const DashboardDataContext = createContext(null)

export function DashboardDataProvider({ children }) {
  const [recipients, setRecipients] = useState([])
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [people, activity, summary] = await Promise.all([
        api('/recipients'),
        api('/transactions'),
        api('/dashboard'),
      ])
      setRecipients(people)
      setTransactions(activity)
      setStats(summary)
      setConnected(true)
      setError('')
    } catch (requestError) {
      setConnected(false)
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <DashboardDataContext.Provider value={{ recipients, transactions, stats, connected, loading, error, refresh }}>
      {children}
    </DashboardDataContext.Provider>
  )
}

export function useDashboardData() {
  const value = useContext(DashboardDataContext)
  if (!value) throw new Error('useDashboardData must be used inside DashboardDataProvider')
  return value
}
