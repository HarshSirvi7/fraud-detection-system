
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fraud-detection-system-ufjz.onrender.com/api'

export async function api(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(localStorage.getItem('clearpay_token') ? { Authorization: `Bearer ${localStorage.getItem('clearpay_token')}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error('Could not connect to the backend. Make sure the Java API is running.')
  }

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.message || body.error || `Request failed (${response.status}).`)
  }
  return body
}

export const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(value || 0)
