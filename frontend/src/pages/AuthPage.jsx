import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'

export default function AuthPage({ mode, onAuthenticated }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const result = await api(`/auth/${isSignup ? 'signup' : 'login'}`, { method: 'POST', body: JSON.stringify(form) })
      onAuthenticated(result)
      navigate('/overview', { replace: true })
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" to="/login"><span className="brand-mark">c</span><span>clear<span className="brand-light">pay</span></span></Link>
        <p className="eyebrow">CLEARPAY ACCOUNT</p>
        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-subtitle">{isSignup ? 'Sign up to access your secure payment workspace.' : 'Log in to continue to your payment workspace.'}</p>
        <form className="auth-form" onSubmit={submit}>
          {isSignup && <label>Full name<input autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>}
          <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
          <label>Password<input type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? 8 : undefined} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={isSignup ? 'At least 8 characters' : 'Your password'} /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}</button>
        </form>
        <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to ClearPay?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link></p>
      </section>
    </main>
  )
}
