import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import StatCard from '../components/common/StatCard.jsx'
import TransactionList from '../components/activity/TransactionList.jsx'
import { useDashboardData } from '../app/DashboardDataContext.jsx'
import Icon from '../components/common/Icon.jsx'

export default function OverviewPage() {
  const { stats, transactions, loading, error } = useDashboardData()
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  return (
    <>
      <PageHeader eyebrow={today} title={<>Transfer safety, <span>at a glance.</span></>} subtitle="Review activity and check recipients before sending money." action={<Link className="primary-button link-button" to="/send">New transfer <Icon name="arrowRight" size={16} /></Link>} />
      {error && <div className="notice" role="alert">{error}</div>}
      <section className="stats-grid" aria-label="Transfer summary">
        <StatCard label="Transfers recorded" value={stats?.totalTransfers} helper="Stored transfer records" icon="activity" tone="lavender" />
        <StatCard label="Safe transfers" value={stats?.safeTransfers} helper="Based on recorded checks" icon="shield" tone="mint" />
        <StatCard label="Recipients" value={stats?.recipientCount} helper="Registered accounts" icon="people" tone="amber" />
        <StatCard label="Fraud reports" value={stats?.fraudReports} helper="Reports on recipient records" icon="alert" tone="rose" />
      </section>
      <div className="section-heading">
        <div><h2>Recent activity</h2><p>Latest transfer records stored by the backend.</p></div>
        <Link className="text-link" to="/activity">View all <Icon name="arrowRight" size={15} /></Link>
      </div>
      <section className="panel activity-panel"><TransactionList transactions={transactions.slice(0, 5)} emptyMessage={loading ? 'Loading transfer records…' : 'No transfer records yet.'} /></section>
    </>
  )
}
