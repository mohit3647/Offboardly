'use client'

import { useState } from 'react'

interface WaitlistFormProps {
  large?: boolean
}

export function WaitlistForm({ large }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
    if (!formId) {
      setError('Waitlist signup is temporarily unavailable. Please try again soon.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Submission failed')
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-500/10 ${
          large ? 'px-8 py-5' : 'px-6 py-4'
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className={`text-purple-300 ${large ? 'text-base' : 'text-sm'}`}>
          You&apos;re on the list. We&apos;ll reach out personally when we&apos;re ready for you.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@company.com"
          required
          className={`flex-1 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 backdrop-blur-sm transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 ${
            large ? 'px-6 py-4 text-base' : 'px-5 py-3 text-sm'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl bg-purple-600 font-semibold text-white transition hover:bg-purple-500 active:scale-95 disabled:opacity-50 ${
            large ? 'px-10 py-4 text-base' : 'px-8 py-3 text-sm'
          }`}
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </button>
      </form>
      {error && (
        <p className={`mt-3 text-red-400 ${large ? 'text-sm' : 'text-xs'}`}>{error}</p>
      )}
    </div>
  )
}
