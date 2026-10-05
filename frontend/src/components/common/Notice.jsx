import Icon from './Icon.jsx'

export default function Notice({ children, tone = 'warning', onDismiss }) {
  if (!children) return null
  return (
    <div className={`notice ${tone === 'success' ? 'success-notice' : ''}`} role="status">
      <span aria-hidden="true"><Icon name={tone === 'success' ? 'check' : 'alert'} size={16} /></span>
      {children}
      {onDismiss && <button onClick={onDismiss} aria-label="Dismiss notice"><Icon name="close" size={16} /></button>}
    </div>
  )
}
