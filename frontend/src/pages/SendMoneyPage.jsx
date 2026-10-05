import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import Notice from '../components/common/Notice.jsx'
import RiskResult from '../components/transfer/RiskResult.jsx'
import { useDashboardData } from '../app/DashboardDataContext.jsx'
import { api, money } from '../services/api.js'
import Icon from '../components/common/Icon.jsx'

export default function SendMoneyPage() {
  const { recipients, connected, refresh } = useDashboardData()
  const [recipientId, setRecipientId] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [amount, setAmount] = useState('')
  const [risk, setRisk] = useState(null)
  const [notice, setNotice] = useState('')
  const [tone, setTone] = useState('warning')
  const [busy, setBusy] = useState(false)
  const selected = useMemo(() => recipients.find((person) => person.recipientId === recipientId), [recipients, recipientId])

  function chooseRecipient(value) {
    const id = value.trim().toUpperCase()
    setRecipientId(id)
    setRecipientName(recipients.find((person) => person.recipientId === id)?.name || '')
    setRisk(null)
  }

  async function checkRecipient(event) {
    event.preventDefault()
    setBusy(true); setNotice(''); setRisk(null)
    try {
      setRisk(await api('/risk/check', { method: 'POST', body: JSON.stringify({ recipientId, recipientName, amount: Number(amount) }) }))
    } catch (error) { setTone('warning'); setNotice(error.message) } finally { setBusy(false) }
  }

  async function sendTransfer() {
    setBusy(true); setNotice('')
    try {
      const transfer = await api('/transfers', { method: 'POST', body: JSON.stringify({ recipientId, recipientName, amount: Number(amount) }) })
      setTone('success')
      setNotice(`Transfer ${transfer.id} recorded for ${money(transfer.amount)} to ${transfer.recipientName || transfer.recipientId}.`)
      setRisk(null); setAmount('')
      await refresh()
    } catch (error) { setTone('warning'); setNotice(error.message) } finally { setBusy(false) }
  }

  return <>
    <PageHeader eyebrow="TRANSFER SAFETY" title="Send money" subtitle="Check a recipient’s history before recording a transfer." />
    <Notice tone={tone} onDismiss={() => setNotice('')}>{notice}</Notice>
    <div className="section-heading"><div><h2>Check recipient</h2><p>Your server evaluates account history, fraud reports, and transfer amount.</p></div><span className="encrypted"><Icon name="lock" size={13} /> LIVE DATABASE CHECK</span></div>
    <section className="work-grid" id="transfer">
      <div className="panel transfer-panel">
        <div className="panel-title"><div className="title-icon"><Icon name="send" size={18} /></div><div><h3>Transfer details</h3><p>Risk assessment comes from the API</p></div><span className="step-pill">STEP 1 OF 2</span></div>
        <form onSubmit={checkRecipient}>
          <label htmlFor="recipient">Saved recipient</label>
          <div className="select-wrap"><span className="field-icon"><Icon name="user" size={16} /></span><select id="recipient" value={recipientId} onChange={(event) => chooseRecipient(event.target.value)}><option value="">Choose a saved recipient</option>{recipients.map((person) => <option value={person.recipientId} key={person.recipientId}>{person.name} · {person.recipientId}</option>)}</select><span className="select-arrow"><Icon name="chevronDown" size={15} /></span></div>
          <div className="or-divider"><span>or enter an account ID</span></div>
          <label htmlFor="account">Recipient account ID</label>
          <div className="input-wrap"><span className="field-icon">#</span><input id="account" placeholder="Enter recipient account ID" value={recipientId} onChange={(event) => chooseRecipient(event.target.value)} required /></div>
          {!selected && <><label htmlFor="name">Recipient name <span className="optional">(optional)</span></label><div className="input-wrap"><span className="field-icon"><Icon name="user" size={16} /></span><input id="name" placeholder="Name shown for this transfer" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} /></div></>}
          <label htmlFor="amount">Amount</label>
          <div className="amount-wrap"><span>₹</span><input id="amount" type="number" min="1" step="1" placeholder="0.00" value={amount} onChange={(event) => { setAmount(event.target.value); setRisk(null) }} required /><span className="currency">INR</span></div>
          <div className="helper-text">No sample records are used. Risk results are based on backend data.</div>
          <button className="primary-button" type="submit" disabled={busy || !recipientId || !amount || !connected}>{busy ? <><span className="spinner" /> Checking…</> : <>Check recipient <Icon name="arrowRight" size={16} /></>}</button>
        </form>
      </div>
      <div className="panel result-panel"><RiskResult risk={risk} amount={amount} busy={busy} onConfirm={sendTransfer} /></div>
    </section>
  </>
}
