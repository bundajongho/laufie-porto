import Section from '@/components/common/Section'
import SectionHeading from '@/components/common/SectionHeading'
import { Mail, Phone, MapPin, Send, Zap } from 'lucide-react'
import { FooterContent } from './FooterSection'
import { m } from 'framer-motion'
import React from 'react'
import { contact } from '@/data/socials'
import { useToast } from '@/providers/ToastProvider'

export default function ContactSection() {
  const { toast } = useToast()

  return (
    <Section id="contact">
      {/* Scoped helpers */}
      <style>{`
        input.form-field:-webkit-autofill,
        textarea.form-field:-webkit-autofill {
          -webkit-text-fill-color: hsl(var(--text)) !important;
          caret-color: hsl(var(--text)) !important;
          transition: background-color 99999s ease-in-out 0s !important;
          box-shadow: 0 0 0px 1000px rgba(255,255,255,0.06) inset !important;
          border-color: transparent !important;
        }
        input.form-field:-webkit-autofill + .focus-ring,
        textarea.form-field:-webkit-autofill + .focus-ring {
          opacity: 1;
        }
        @keyframes logoSheenMove {
          from { transform: translateX(-150%); }
          to   { transform: translateX(150%); }
        }
        .logo-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0) 32%,
            rgba(255,255,255,0.8) 50%,
            rgba(255,255,255,0) 68%
          );
          mix-blend-mode: screen;
          filter: blur(12px);
          transform: translateX(-150%);
          animation: logoSheenMove 1.6s cubic-bezier(0.22,1,0.36,1) infinite;
          pointer-events: none;
        }
      `}</style>

      <SectionHeading
        title="Get In"
        highlight="Touch"
        subtitle="I'm always open to discussing opportunities, creative projects, or just having a conversation about technology and design."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Contact methods */}
        <div className="space-y-4">
          <ContactCard
            icon={Mail}
            label="Email"
            value={contact.email}
            href={`mailto:${contact.email}`}
            sheenDelay="0s"
          />
          <ContactCard
            icon={Phone}
            label="Phone"
            value={contact.phone}
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
            sheenDelay=".7s"
          />
          <ContactCard
            icon={MapPin}
            label="Location"
            value={contact.location}
            sheenDelay="1.4s"
          />

          <div className="glass rounded-2xl p-5">
            <div className="text-lg font-semibold">Available for Freelance</div>
            <p className="mt-2 text-white/70">
              I&apos;m currently available for freelance projects and consulting work. Let&apos;s discuss how we
              can bring your ideas to life.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <form
          className="glass relative rounded-2xl p-6 md:p-7"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const nameEl = form.querySelector<HTMLInputElement>('input[name="name"]')
            const emailEl = form.querySelector<HTMLInputElement>('input[name="email"]')
            const messageEl = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]')

            const name = nameEl?.value.trim() || ''
            const email = emailEl?.value.trim() || ''
            const message = messageEl?.value.trim() || ''

            if (!email || !isEmailValid(email)) {
              toast('Please enter a valid email address.', { variant: 'error' })
              emailEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              setTimeout(() => emailEl?.focus({ preventScroll: true }), 220)
              return
            }

            if (!name || !message) {
              toast('Please fill in all required fields.', { variant: 'error' })
              const target = !name ? nameEl : messageEl
              target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              setTimeout(() => target?.focus({ preventScroll: true }), 220)
              return
            }

            toast('Message sent successfully!', { variant: 'success' })
          }}
          noValidate
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Name" name="name" required placeholder="Your full name" autoComplete="name" />
            <Input label="Email" name="email" type="email" required placeholder="your.email@example.com" autoComplete="email" />
          </div>

          <div className="mt-5">
            <Input label="Subject" name="subject" placeholder="What's this about?" autoComplete="organization-title" />
          </div>

          <div className="mt-5">
            <TextArea
              label="Message"
              name="message"
              required
              rows={6}
              placeholder="Tell me about your project or how I can help..."
              autoComplete="off"
            />
          </div>

          <button
            className="
              group mt-6 w-full rounded-xl px-4 py-3 font-medium
              text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]
            "
            style={{ background: 'linear-gradient(90deg, var(--c3), var(--c2))' }}
            type="submit"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <span
                className="
                  inline-grid place-items-center transform-gpu
                  transition-transform duration-700
                  group-hover:rotate-[360deg]
                "
              >
                <Send size={18} />
              </span>
              Send Message
            </span>
          </button>
        </form>
      </div>

      <div className="mt-16">
        <FooterContent />
      </div>
    </Section>
  )
}

/* ======================== Helpers ======================== */
function isEmailValid(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return re.test(email)
}

/* ======================== Subcomponents ======================== */
function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  sheenDelay = '0s',
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  href?: string
  sheenDelay?: string
}) {
  const inner = (
    <div
      className="
        glass grad-hover group relative flex items-center gap-4 rounded-2xl p-5
        transition-all duration-300
      "
    >
      <div
        className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl"
        style={{
          background: 'linear-gradient(90deg, var(--c3), var(--c2))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.25)',
        }}
      >
        <Icon className="text-white" />
        <span className="logo-sheen" aria-hidden style={{ animationDelay: sheenDelay as any }} />
      </div>

      <div className="min-w-0">
        <div className="text-sm text-white/70">{label}</div>
        <div className="truncate font-medium text-white/90">{value}</div>
      </div>

      <Zap
        size={18}
        className="ml-auto transition-opacity duration-300 group-hover:opacity-80"
        style={{ color: 'hsl(var(--text))', opacity: 0.45 }}
        aria-hidden
      />
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {inner}
      </a>
    )
  }
  return inner
}

function Input({
  label,
  className,
  required,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className || ''}`}>
      <div className="mb-2 text-sm text-white/70">
        {label} {required && <span className="text-red-500">*</span>}
      </div>

      <div className="relative">
        <input
          {...rest}
          required={required}
          className="
            form-field peer w-full rounded-xl border border-white/10
            bg-white/5 px-4 py-3 text-white/90 outline-none
            placeholder:text-white/40 transition-colors duration-150
            focus:border-transparent focus:bg-white/[0.06]
          "
        />
        <span
          aria-hidden
          className="
            focus-ring pointer-events-none absolute inset-0 rounded-xl
            opacity-0 transition-opacity duration-150
            peer-focus:opacity-100 peer-focus-visible:opacity-100
          "
          style={{
            background: 'linear-gradient(90deg, var(--c2), var(--c3))',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
            filter: 'blur(0.25px)',
            borderRadius: '0.75rem',
          }}
        />
      </div>
    </label>
  )
}

function TextArea({
  label,
  className,
  required,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className || ''}`}>
      <div className="mb-2 text-sm text-white/70">
        {label} {required && <span className="text-red-500">*</span>}
      </div>

      <div className="relative rounded-xl">
        <textarea
          {...rest}
          required={required}
          className="
            form-field peer w-full resize-none rounded-xl border border-white/10
            bg-white/5 px-4 py-3 text-white/90 outline-none
            placeholder:text-white/40 transition-colors duration-150
            focus:border-transparent focus:bg-white/[0.06]
          "
        />
        <span
          aria-hidden
          className="
            focus-ring pointer-events-none absolute inset-0 rounded-xl
            opacity-0 transition-opacity duration-150
            peer-focus:opacity-100 peer-focus-visible:opacity-100
          "
          style={{
            background: 'linear-gradient(90deg, var(--c2), var(--c3))',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
            filter: 'blur(0.25px)',
            borderRadius: '0.75rem',
          }}
        />
      </div>
    </label>
  )
}