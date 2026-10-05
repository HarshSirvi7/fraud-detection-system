import { money } from '../../services/api.js'
import StatusBadge from '../common/StatusBadge.jsx'

export default function TransactionList({ transactions, emptyMessage = 'No transfer records in the database yet.' }) {
  if (!transactions.length) return <div className="no-activity">{emptyMessage}</div>
  return (
    <div className="activity-table-wrap">
      <div className="activity-header"><span>RECIPIENT</span><span>DATE</span><span>AMOUNT</span><span>SAFETY CHECK</span></div>
      {transactions.map((item) => (
        <div className="activity-row" key={item.id}>
          <div className="person-cell">
            <div className="person-avatar">{(item.recipientName || item.recipientId || 'R').split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
            <div><strong>{item.recipientName || item.recipientId}</strong><span>{item.recipientId}</span></div>
          </div>
          <span className="date-cell">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
          <strong className="amount-cell">{money(item.amount)}</strong>
          <StatusBadge status={item.riskLevel}>{item.riskLevel === 'FRAUDULENT' ? 'Blocked' : item.riskLevel?.toLowerCase()}</StatusBadge>
        </div>
      ))}
    </div>
  )
}
