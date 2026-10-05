import PageHeader from '../components/common/PageHeader.jsx'
import TransactionList from '../components/activity/TransactionList.jsx'
import { useDashboardData } from '../app/DashboardDataContext.jsx'

export default function ActivityPage() {
  const { transactions, loading, error } = useDashboardData()
  return <>
    <PageHeader eyebrow="TRANSFER HISTORY" title="Activity" subtitle="Transfer records and the risk decision saved for each one." />
    {error && <div className="notice" role="alert">{error}</div>}
    <section className="panel activity-panel"><TransactionList transactions={transactions} emptyMessage={loading ? 'Loading transfer records…' : 'No transfer records yet.'} /></section>
  </>
}
