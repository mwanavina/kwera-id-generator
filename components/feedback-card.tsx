'use client'

import { useState, useEffect } from 'react'
import { ThumbsUp } from 'lucide-react'
import { recordHelpfulVote } from '@/app/actions'

const VOTED_KEY = 'kwera-helpful-voted'

export function FeedbackCard({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState<number>(initialCount)
  const [voted, setVoted] = useState<boolean>(false)
  const [pending, setPending] = useState<boolean>(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(VOTED_KEY) === 'true') setVoted(true)
    } catch {
      // ignore
    }
  }, [])

  const handleVote = async () => {
    if (voted || pending) return
    setPending(true)
    setVoted(true)
    try {
      localStorage.setItem(VOTED_KEY, 'true')
    } catch {
      // ignore
    }
    const res = await recordHelpfulVote()
    if (res.ok) setCount(res.count)
    setPending(false)
  }

  const noun = count === 1 ? 'person' : 'people'

  return (
    <section className="rounded-2xl border border-border bg-gradient-to-b from-card to-card-soft p-[22px] text-center">
      <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wide text-text-dim">
        Feedback
      </h2>
      <p className="mb-3.5 text-[14.5px] text-foreground">
        Has this tool been useful to you?
      </p>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleVote}
          disabled={voted}
          className={`inline-flex items-center gap-2 rounded-full border-[1.5px] px-5 py-2.5 text-sm font-semibold transition ${
            voted
              ? 'cursor-default border-cyan bg-cyan-dim text-cyan'
              : 'border-border bg-cyan/[0.08] text-foreground hover:border-cyan'
          }`}
        >
          <ThumbsUp size={16} className={voted ? 'scale-110' : ''} />
          {voted ? 'Thanks for letting us know' : 'Yes, this helped'}
        </button>
      </div>
      <p className="mb-1 mt-3.5 font-mono text-[13px] text-text-dim" aria-live="polite">
        <strong className="text-gold">{count}</strong> {noun} found this helpful
      </p>
      <p className="text-[11.5px] text-text-faint">
        Shared total, visible to everyone who uses this tool.
      </p>
    </section>
  )
}
