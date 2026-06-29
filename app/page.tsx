import Image from 'next/image'
import { Eye } from 'lucide-react'
import { IdGenerator } from '@/components/id-generator'
import { FeedbackCard } from '@/components/feedback-card'
import { getHelpfulCount, recordPageVisit } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [initialCount, visitResult] = await Promise.all([getHelpfulCount(), recordPageVisit()])

  const usageCount = visitResult.ok ? visitResult.count : 0

  return (
    <main className="relative px-4 pb-16 pt-7">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_50%_0%,black,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[640px]">
        <header className="mb-7">
          <div className="flex items-center gap-4">
            <Image
              src="/kwera-logo.jpg"
              alt="KWERA logo"
              width={56}
              height={56}
              className="h-14 w-14 flex-shrink-0 rounded-xl border border-border object-cover"
              priority
            />
            <div className="flex h-14 flex-col justify-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-cyan">
                KWERA · Finance One, Educate All
              </div>
              <h1 className="mt-1.5 font-heading text-[clamp(24px,5.5vw,32px)] font-bold leading-none tracking-tight text-balance">
                ID Generator
              </h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-dim text-pretty">
            Enter a member&apos;s details to build their KWERA ID.
          </p>
        </header>

        <IdGenerator />

        <div className="mt-[18px]">
          <FeedbackCard initialCount={initialCount} />
        </div>

        <footer className="mt-5 text-center text-xs leading-relaxed text-text-faint">
          KWERA · George Kalua · WhatsApp +265 992 838 636 ·{' '}
          <a href="mailto:gka@kwera.com" className="text-cyan no-underline">
            gka@kwera.com
          </a>
          <br />
          {/* Your ID log is saved on this device. The feedback total is shared across
          everyone using this page.
          <br /> */}
          <span className="mt-1.5 inline-flex items-center gap-1.5">
            <Eye size={12} className="text-text-dim" aria-hidden="true" />
            <span className="font-semibold text-text-dim">{usageCount}</span> people have used this tool
          </span>
          <br />
          <span className="mt-1.5 inline-block">
            Developed by{' '}
            <span className="font-semibold text-text-dim">Mark Mwanavina</span> ·
            Full-Stack Developer
          </span>
        </footer>
      </div>
    </main>
  )
}
