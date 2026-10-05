import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useDashboardData } from '../../app/DashboardDataContext.jsx'
import Icon from '../common/Icon.jsx'

const navigation = [
  { to: '/overview', label: 'Overview', icon: 'overview' },
  { to: '/send', label: 'Send money', icon: 'send' },
  { to: '/activity', label: 'Activity', icon: 'activity' },
  { to: '/recipients', label: 'Recipients', icon: 'people' },
]

const pageNames = {
  '/overview': 'Overview',
  '/send': 'Send money',
  '/activity': 'Activity',
  '/recipients': 'Recipients',
}

export default function AppShell({ user, onLogout }) {
  const { connected, stats } = useDashboardData()
  const { pathname } = useLocation()
  const title = pageNames[pathname] || 'Page not found'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/overview" aria-label="ClearPay home">
          <span className="brand-mark">c</span><span>clear<span className="brand-light">pay</span></span>
        </NavLink>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} key={item.to} to={item.to}>
              <Icon name={item.icon} className="nav-icon" />{item.label}
              {item.to === '/activity' && stats && <span className="nav-count">{stats.totalTransfers}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="secure-card">
            <div className="secure-icon"><Icon name="shield" size={21} /></div>
            <strong>Recipient protection</strong>
            <p>Check history and fraud reports before recording a transfer.</p>
            <span className="secure-live"><i /> DATABASE {connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
          </div>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> <b>{title}</b></div>
          <div className="top-actions"><span className="system-status"><i className={connected ? '' : 'offline'} />{connected ? 'Connected to backend' : 'Backend unavailable'}</span><span className="account-name">{user?.name}</span><button className="logout-button" onClick={onLogout}>Log out</button></div>
        </header>
        <div className="content"><Outlet /></div>
      </main>
    </div>
  )
}
