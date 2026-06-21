'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ChangeEvent } from 'react'
import { Copy, Save, Check, X, Play } from 'lucide-react'

const HISTORY_KEY = 'kwera-id-log'

type FormState = {
  firstName: string
  lastName: string
  dob: string
  cohort: string
}

type IdResult =
  | { ok: false }
  | {
      ok: true
      id: string
      namePart: string
      dobPart: string
      cohortPart: string
      first: string
      last: string
      dob: string
      cohortVal: string
      warning: string
    }

type HistoryItem = {
  name: string
  id: string
  savedAt: string
}

type SegmentKey = 'name' | 'dob' | 'cohort'

function pad(n: string): string {
  return String(n).padStart(2, '0')
}

function computeId({ firstName, lastName, dob, cohort }: FormState): IdResult {
  const first = firstName.trim()
  const last = lastName.trim()
  const cohortVal = cohort.trim()

  if (!first || !last || !dob || cohortVal === '') {
    return { ok: false }
  }

  const namePart = (first.slice(0, 2) + last.slice(0, 2)).toUpperCase()
  const [y, m, d] = dob.split('-')
  const dobPart = pad(d) + pad(m) + y
  const cohortPart = 'C' + cohortVal

  let warning = ''
  if (first.length < 2 || last.length < 2) {
    warning =
      'First or last name is under 2 letters, so that part of the ID is shorter than usual.'
  }

  return {
    ok: true,
    id: namePart + dobPart + cohortPart,
    namePart,
    dobPart,
    cohortPart,
    first,
    last,
    dob,
    cohortVal,
    warning,
  }
}

const SEGMENT_STYLES: Record<SegmentKey, string> = {
  name: 'text-cyan bg-cyan-dim',
  dob: 'text-foreground bg-white/[0.06]',
  cohort: 'text-gold bg-gold-dim',
}

function IdChips({ result }: { result: IdResult }) {
  if (!result.ok) {
    return (
      <span className="rounded-md bg-white/[0.03] px-2.5 py-1 text-sm font-medium text-text-faint">
        Fill in all fields
      </span>
    )
  }
  const segments: { text: string; cls: SegmentKey }[] = [
    { text: result.namePart, cls: 'name' },
    { text: result.dobPart, cls: 'dob' },
    { text: result.cohortPart, cls: 'cohort' },
  ]
  return segments.flatMap((seg) =>
    [...seg.text].map((ch, i) => (
      <span
        key={`${seg.cls}-${i}-${ch}`}
        className={`chip-pop inline-flex w-[1.05em] items-center justify-center rounded-[5px] px-px py-1 font-mono text-xl font-bold sm:text-2xl ${SEGMENT_STYLES[seg.cls]}`}
      >
        {ch}
      </span>
    )),
  )
}

export function IdGenerator() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    dob: '',
    cohort: '',
  })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [copied, setCopied] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false)

  const result = computeId(form)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw) as HistoryItem[])
    } catch {
      // ignore
    }
  }, [])

  const persist = useCallback((list: HistoryItem[]) => {
    setHistory(list)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  }, [])

  const onChange =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleCopy = async () => {
    if (!result.ok) return
    try {
      await navigator.clipboard.writeText(result.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  const handleSave = () => {
    if (!result.ok) return
    persist([
      {
        name: `${result.first} ${result.last}`,
        id: result.id,
        savedAt: new Date().toISOString(),
      },
      ...history,
    ])
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  const handleCopyItem = async (idx: number) => {
    try {
      await navigator.clipboard.writeText(history[idx].id)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 1000)
    } catch {
      // ignore
    }
  }

  const handleDelete = (idx: number) =>
    persist(history.filter((_, i) => i !== idx))

  const inputClass =
    'w-full rounded-[10px] border-[1.5px] border-border bg-black/[0.18] px-3 py-2.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-text-faint focus:bg-cyan/[0.06]'

  return (
    <div className="flex flex-col gap-[18px]">
      <button
        type="button"
        onClick={() => setIsTutorialOpen(true)}
        aria-label="Open tutorial"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan px-4 py-3 text-sm font-semibold text-[#06222b] shadow-lg shadow-cyan/10 transition hover:scale-[1.02]"
      >
        <Play size={16} />
        How it works
      </button>

      {isTutorialOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 backdrop-blur-sm sm:p-4">
          <div className="relative flex h-full w-full max-w-7xl items-center justify-center overflow-hidden rounded-2xl border border-border bg-background">
            <button
              type="button"
              onClick={() => setIsTutorialOpen(false)}
              aria-label="Close tutorial"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-text-dim transition hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="flex h-full w-full items-center justify-center overflow-hidden p-2 sm:p-4">
              <img
                src="/Kwera_ID_Generator_Tutorial.gif"
                alt="KWERA ID generator tutorial"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Member details */}
      <section className="rounded-2xl border border-border bg-gradient-to-b from-card to-card-soft p-[22px]">
        <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wide text-text-dim">
          Member details
        </h2>
        <div className="mb-3.5">
          <label htmlFor="firstName" className="mb-1.5 block text-[13px] text-text-dim">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="off"
            placeholder="e.g. John"
            value={form.firstName}
            onChange={onChange('firstName')}
            className={`${inputClass} focus:border-cyan`}
          />
        </div>
        <div className="mb-3.5">
          <label htmlFor="lastName" className="mb-1.5 block text-[13px] text-text-dim">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="off"
            placeholder="e.g. Chirwa"
            value={form.lastName}
            onChange={onChange('lastName')}
            className={`${inputClass} focus:border-cyan`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="dob" className="mb-1.5 block text-[13px] text-text-dim">
              Date of birth
            </label>
            <input
              id="dob"
              type="date"
              value={form.dob}
              onChange={onChange('dob')}
              className={`${inputClass} focus:border-foreground`}
            />
          </div>
          <div>
            <label htmlFor="cohort" className="mb-1.5 block text-[13px] text-text-dim">
              Cohort number
            </label>
            <input
              id="cohort"
              type="number"
              min="0"
              placeholder="e.g. 6"
              value={form.cohort}
              onChange={onChange('cohort')}
              className={`${inputClass} focus:border-gold`}
            />
          </div>
        </div>
      </section>

      {/* Generated ID */}
      <section className="rounded-2xl border border-border bg-gradient-to-b from-card to-card-soft p-[22px] text-center">
        <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wide text-text-dim">
          Generated ID
        </h2>
        <div
          className="mx-0 mb-3.5 mt-1.5 flex min-h-12 flex-wrap items-center justify-center gap-[3px]"
          aria-live="polite"
        >
          <IdChips result={result} />
        </div>
        <div className="mb-[18px] flex flex-wrap justify-center gap-4 text-xs text-text-dim">
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full bg-cyan" />
            Name
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full bg-foreground" />
            Birthdate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2 w-2 rounded-full bg-gold" />
            Cohort
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result.ok}
            className="inline-flex items-center gap-2 rounded-[10px] bg-cyan px-[18px] py-2.5 text-sm font-semibold text-[#06222b] transition active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-text-faint"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy ID'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!result.ok}
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-transparent px-[18px] py-2.5 text-sm font-semibold text-text-dim transition active:scale-[0.97] hover:text-foreground disabled:cursor-not-allowed disabled:text-text-faint"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Saved' : 'Save to log'}
          </button>
        </div>
        {result.ok && result.warning ? (
          <p className="mt-2.5 text-[13px] text-danger">{result.warning}</p>
        ) : null}
      </section>

      {/* Breakdown */}
      {result.ok ? (
        <section className="rounded-2xl border border-border bg-gradient-to-b from-card to-card-soft p-[22px]">
          <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wide text-text-dim">
            Breakdown
          </h2>
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                <th className="border-b border-border pb-2 text-left text-[11px] font-medium uppercase tracking-wide text-text-faint">
                  Component
                </th>
                <th className="border-b border-border pb-2 text-left text-[11px] font-medium uppercase tracking-wide text-text-faint">
                  Input data
                </th>
                <th className="border-b border-border pb-2 text-left text-[11px] font-medium uppercase tracking-wide text-text-faint">
                  ID segment
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-border py-2.5">Name</td>
                <td className="border-b border-border py-2.5">
                  {result.first} {result.last}
                </td>
                <td className="border-b border-border py-2.5 font-mono text-cyan">
                  {result.namePart}
                </td>
              </tr>
              <tr>
                <td className="border-b border-border py-2.5">Birthdate</td>
                <td className="border-b border-border py-2.5">{result.dob}</td>
                <td className="border-b border-border py-2.5 font-mono">
                  {result.dobPart}
                </td>
              </tr>
              <tr>
                <td className="py-2.5">Cohort</td>
                <td className="py-2.5">Cohort {result.cohortVal}</td>
                <td className="py-2.5 font-mono text-gold">{result.cohortPart}</td>
              </tr>
            </tbody>
          </table>
        </section>
      ) : null}

      {/* Recent IDs */}
      <section className="rounded-2xl border border-border bg-gradient-to-b from-card to-card-soft p-[22px]">
        <h2 className="mb-4 font-heading text-sm font-medium uppercase tracking-wide text-text-dim">
          Recent IDs
        </h2>
        {history.length === 0 ? (
          <div className="px-0 pb-1 pt-2.5 text-center text-[13.5px] text-text-faint">
            No IDs saved yet. Generate one above and save it to start your log.
          </div>
        ) : (
          <div>
            {history.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center justify-between gap-2.5 border-b border-border py-2.5 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] text-foreground">
                    {item.name}
                  </div>
                  <div className="font-mono text-[13px] text-text-dim">{item.id}</div>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyItem(idx)}
                    title="Copy ID"
                    aria-label={`Copy ID for ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-dim transition hover:border-cyan hover:text-foreground"
                  >
                    {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    title="Remove"
                    aria-label={`Remove ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-dim transition hover:border-cyan hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => persist([])}
                className="rounded-[10px] border border-border bg-transparent px-2.5 py-1.5 text-[12.5px] font-semibold text-text-dim transition hover:text-foreground"
              >
                Clear log
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
