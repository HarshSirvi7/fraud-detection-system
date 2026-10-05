import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import ActivityPage from '../pages/ActivityPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import OverviewPage from '../pages/OverviewPage.jsx'
import RecipientsPage from '../pages/RecipientsPage.jsx'
import SendMoneyPage from '../pages/SendMoneyPage.jsx'
import AuthPage from '../pages/AuthPage.jsx'
import { DashboardDataProvider } from './DashboardDataContext.jsx'

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clearpay_user')) } catch { return null }
  })
  const authenticated = Boolean(localStorage.getItem('clearpay_token')) && Boolean(user)
  function acceptAuth(result) {
    localStorage.setItem('clearpay_token', result.accessToken)
    localStorage.setItem('clearpay_user', JSON.stringify(result.user))
    setUser(result.user)
  }
  function logout() {
    localStorage.removeItem('clearpay_token')
    localStorage.removeItem('clearpay_user')
    setUser(null)
  }
  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/overview" replace /> : <AuthPage mode="login" onAuthenticated={acceptAuth} />} />
      <Route path="/signup" element={authenticated ? <Navigate to="/overview" replace /> : <AuthPage mode="signup" onAuthenticated={acceptAuth} />} />
      <Route path="/" element={authenticated ? <DashboardDataProvider><AppShell user={user} onLogout={logout} /></DashboardDataProvider> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="send" element={<SendMoneyPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="recipients" element={<RecipientsPage />} />
          <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
