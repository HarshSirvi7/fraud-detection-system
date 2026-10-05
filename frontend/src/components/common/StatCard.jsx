import Icon from './Icon.jsx'

export default function StatCard({ label, value, helper, icon, tone = 'lavender' }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon name={icon} size={16} /></span></div>
      <strong>{value ?? '—'}</strong>
      <div className="stat-foot">{helper}</div>
    </article>
  )
}
