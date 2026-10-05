import { useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import Notice from '../components/common/Notice.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import { useDashboardData } from '../app/DashboardDataContext.jsx'
import { api } from '../services/api.js'
import Icon from '../components/common/Icon.jsx'

export default function RecipientsPage() {
  const { recipients, connected, loading, refresh } = useDashboardData()
  const [recipientId, setRecipientId] = useState('')
  const [name, setName] = useState('')
  const [notice, setNotice] = useState('')
  const [tone, setTone] = useState('warning')
  const [busy, setBusy] = useState(false)

  async function addRecipient(event) {
    event.preventDefault(); setBusy(true); setNotice('')
    try {
      const person = await api('/recipients', { method: 'POST', body: JSON.stringify({ recipientId, name }) })
      setTone('success'); setNotice(`${person.name} was added to your recipients.`)
      setRecipientId(''); setName('')
      await refresh()
    } catch (error) { setTone('warning'); setNotice(error.message) } finally { setBusy(false) }
  }

  async function reportFraud(person) {
    setBusy(true); setNotice('')
    try {
      await api(`/recipients/${encodeURIComponent(person.recipientId)}/fraud-reports`, { method: 'POST' })
      setTone('success'); setNotice(`A fraud report was recorded for ${person.name}.`)
      await refresh()
    } catch (error) { setTone('warning'); setNotice(error.message) } finally { setBusy(false) }
  }

  return <>
    <PageHeader eyebrow="RECIPIENT DIRECTORY" title="Recipients" subtitle="Manage recipient records and review their transaction history flags." />
    <Notice tone={tone} onDismiss={() => setNotice('')}>{notice}</Notice>
    <section className="panel management-panel">
      <div className="panel-title"><div className="title-icon"><Icon name="user" size={18} /></div><div><h3>Add a recipient</h3><p>New recipient records are saved to the backend database.</p></div></div>
      <form className="add-recipient-form" onSubmit={addRecipient}>
        <div><label htmlFor="new-id">Account ID</label><input id="new-id" value={recipientId} onChange={(event) => setRecipientId(event.target.value.toUpperCase())} placeholder="Account ID" required /></div>
        <div><label htmlFor="new-name">Recipient name</label><input id="new-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" required /></div>
        <button className="primary-button" disabled={busy || !connected}>{busy ? 'Saving…' : 'Add recipient'}</button>
      </form>
      <div className="directory-heading"><h3>Saved recipients</h3><span>{recipients.length} total</span></div>
      {recipients.length ? <div className="recipient-list">
        {recipients.map((person) => <div className="recipient-row" key={person.recipientId}>
          <div className="person-avatar">{person.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          <div className="recipient-details"><strong>{person.name}</strong><span>{person.recipientId} · {person.transactionCount} transfers · {person.fraudReports} fraud reports</span></div>
          <StatusBadge status={person.fraudReports ? 'FRAUDULENT' : 'SAFE'}>{person.fraudReports ? 'Reported' : 'No reports'}</StatusBadge>
          <button className="report-button" onClick={() => reportFraud(person)} disabled={busy}>Record fraud report</button>
        </div>)}
      </div> : <div className="no-activity">{loading ? 'Loading recipients…' : 'No recipients yet. Add one above to get started.'}</div>}
    </section>
  </>
}
