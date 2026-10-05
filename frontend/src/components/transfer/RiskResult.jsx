import { money } from '../../services/api.js'
import Icon from '../common/Icon.jsx'

export default function RiskResult({ risk, amount, busy, onConfirm }) {
  if (!risk) {
    return (
      <div className="empty-result">
        <div className="shield-art"><div className="shield-inner"><Icon name="shield" size={28} /></div><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="sparkle sparkle-one">✦</span><span className="sparkle sparkle-two">·</span></div>
        <h3>Your safety check appears here</h3>
        <p>Enter a recipient account and amount. The API checks stored transaction history and fraud reports.</p>
        <div className="trust-note"><span>✳</span> Risk details come from the backend</div>
      </div>
    )
  }

  const tone = risk.riskLevel.toLowerCase()
  return (
    <div className="risk-result">
      <div className={`result-symbol ${tone}`}><Icon name={tone === 'safe' ? 'check' : tone === 'suspicious' ? 'alert' : 'close'} size={19} /></div>
      <span className={`risk-label ${tone}`}>{tone === 'fraudulent' ? 'HIGH RISK' : `${risk.riskLevel} RECIPIENT`}</span>
      <h3>{risk.recipientName || risk.recipientId}</h3>
      <p className="result-message">{risk.message}</p>
      <div className="score-row"><span>Risk score</span><strong>{risk.riskScore}<small> / 100</small></strong></div>
      <div className="score-track"><span className={tone} style={{ width: `${risk.riskScore}%` }} /></div>
      <div className="history-facts">
        <div><strong>{risk.transactionCount}</strong><span>Previous transfers</span></div>
        <div><strong>{risk.fraudReports}</strong><span>Fraud reports</span></div>
        <div><strong>{tone === 'safe' ? 'Verified' : tone === 'fraudulent' ? 'Flagged' : 'Review'}</strong><span>Recipient status</span></div>
      </div>
      <div className="reason-list">{risk.reasons.map((reason) => <div key={reason}><span><Icon name="check" size={13} /></span>{reason}</div>)}</div>
      {tone !== 'fraudulent'
        ? <button className="primary-button confirm-button" onClick={onConfirm} disabled={busy}>{busy ? 'Saving transfer…' : <>Confirm and record {money(amount)} <Icon name="arrowRight" size={16} /></>}</button>
        : <div className="blocked-note">The API blocks transfer records for high risk recipients.</div>}
    </div>
  )
}
