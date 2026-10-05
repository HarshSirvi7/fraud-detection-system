export default function StatusBadge({ status, children }) {
  const tone = (status || '').toLowerCase()
  return <span className={`status-badge ${tone}`}>{children || status}</span>
}
