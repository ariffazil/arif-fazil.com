import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'

/**
 * Legal — /privacy and /terms.
 *
 * Plain-language statements of what this site actually does. Every claim here
 * was probed on 2026-10-28 (cookies, storage, third-party hosts) rather than
 * copied from a template. If the site changes, this page changes with it.
 */

const UPDATED = '2026-10-28'

function Shell({
  title,
  description,
  path,
  children,
}: {
  title: string
  description: string
  path: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2]">
      <PageMeta title={title} description={description} path={path} />
      <section className="border-b border-[#1F2733] bg-[#0A0D14] py-16 md:py-20">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9AA0A8]">
            Plain language · last updated {UPDATED}
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.02em] md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-[68ch] font-body text-[17px] leading-relaxed text-[#9AA0A8]">
            {description}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <div className="max-w-[68ch] space-y-8 font-body text-[16px] leading-relaxed text-[#EDEAE2]">
            {children}
          </div>
          <p className="mt-12 font-mono text-[12px] text-[#9AA0A8]">
            <Link to="/" className="underline decoration-[#1F2733] underline-offset-4 hover:text-[#EDEAE2]">
              ← Home
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 font-display text-2xl tracking-[-0.01em]">{heading}</h2>
      <div className="space-y-3 text-[#EDEAE2]/90">{children}</div>
    </div>
  )
}

export function Privacy() {
  return (
    <Shell
      title="Privacy"
      description="This is a personal site. It has no accounts, no advertising, and no tracking of what you read. Here is exactly what is collected."
      path="/privacy"
    >
      <Block heading="What is collected">
        <p>
          Nothing you read is tracked. There is no login, no newsletter form, and no analytics
          that follows you across sites.
        </p>
        <p>
          The site is served through Cloudflare, which sets one security cookie —
          <span className="font-mono text-[14px] text-[#9AA0A8]"> cf_clearance</span> — to tell
          humans apart from bots. It is not used for advertising. No other cookies are set, and
          this site writes nothing to your browser&apos; storage.
        </p>
      </Block>

      <Block heading="Third parties">
        <p>
          Typefaces load from Google Fonts and Fontshare. Aggregate, cookieless visitor counts
          come from Cloudflare Web Analytics. No personal profile is built from either.
        </p>
      </Block>

      <Block heading="If you email">
        <p>
          A briefing request or an email arrives in an ordinary mailbox and stays there. Your
          address is not added to a list, sold, or shared. Ask and it is deleted.
        </p>
      </Block>

      <Block heading="Agent and machine surfaces">
        <p>
          Public files such as <span className="font-mono text-[14px] text-[#9AA0A8]">surfaces.json</span>,
          {' '}<span className="font-mono text-[14px] text-[#9AA0A8]">llms.txt</span> and the{' '}
          <span className="font-mono text-[14px] text-[#9AA0A8]">.well-known</span> directory exist so
          software can discover what this site publishes. They contain no visitor data.
        </p>
      </Block>

      <Block heading="Contact">
        <p>
          Questions about this page:{' '}
          <a href="mailto:arifbfazil@gmail.com" className="underline decoration-[#1F2733] underline-offset-4 hover:text-white">
            arifbfazil@gmail.com
          </a>
          .
        </p>
      </Block>
    </Shell>
  )
}

export function Terms() {
  return (
    <Shell
      title="Terms"
      description="What this site is, what it is not, and how to read what is on it."
      path="/terms"
    >
      <Block heading="What this site is">
        <p>
          A personal site. It publishes writing, exploration work records, and technical surfaces.
          It is not a company, a service, or an offer of professional advice.
        </p>
      </Block>

      <Block heading="How to read the claims">
        <p>
          Material claims are labelled by how they are known: OBS (observed), DER (derived),
          INT (interpretation), SPEC (speculative), UNKNOWN. Where evidence is incomplete the
          label says so. Take UNKNOWN at face value.
        </p>
        <p>
          Well and basin records describe personal professional contribution. They are not claims
          made on behalf of PETRONAS or any other institution, and internal technical detail is
          withheld.
        </p>
      </Block>

      <Block heading="No warranty">
        <p>
          Everything is provided as-is, for reading. Nothing here is geoscience advice,
          investment advice, or legal advice, and no decision should rest on it alone.
        </p>
      </Block>

      <Block heading="Reuse">
        <p>
          Quoting with attribution is welcome. Republishing whole pieces needs a request first.
          Machine-readable surfaces may be fetched and indexed.
        </p>
      </Block>

      <Block heading="Changes">
        <p>
          This page changes when the site changes. The date at the top is the date it last did.
        </p>
      </Block>
    </Shell>
  )
}
