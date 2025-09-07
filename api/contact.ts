// api/contact.ts
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1, 'Name required').max(80),
  email: z.string().email('Invalid email').max(120),
  subject: z.string().max(140).optional().default('New message from portfolio'),
  message: z.string().min(10, 'Please write at least 10 characters').max(3000),
  hp: z.string().optional().default(''), // honeypot
})

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

function parseBody(body: any) {
  if (!body) return {}
  if (typeof body === 'string') {
    try { return JSON.parse(body) } catch {}
    try { return Object.fromEntries(new URLSearchParams(body)) } catch {}
    return {}
  }
  return body
}

export default async function handler(req: any, res: any) {
  // CORS header (tidak membatasi; hanya set header)
  const allowOrigin = process.env.CONTACT_ALLOWED_ORIGIN || '*'
  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') return res.status(200).json({ ok: true })

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const data = parseBody(req.body)
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid payload',
        issues: parsed.error.flatten(),
      })
    }

    const { name, email, subject, message, hp } = parsed.data
    if (hp && hp.trim() !== '') {
      // bot trap — succeed silently
      return res.status(200).json({ ok: true })
    }

    const TO = (process.env.CONTACT_TO || '').split(',').map((s) => s.trim()).filter(Boolean)
    const FROM = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>'
    const API = process.env.RESEND_API_KEY

    if (!API || TO.length === 0) {
      console.error('[contact] missing env', {
        hasKey: !!API,
        toCount: TO.length,
        from: FROM,
      })
      return res.status(500).json({ ok: false, error: 'Server not configured' })
    }

    const html = `
      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;font-size:14px;color:#0b1220;line-height:1.6">
        <h2 style="margin:0 0 8px">New message from your portfolio</h2>
        <p style="margin:0 0 16px;color:#334155">You received a new message:</p>
        <table cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;border-collapse:collapse">
          <tr><td style="padding:8px 0;width:120px;color:#64748b">Name</td><td style="padding:8px 0;font-weight:600">${esc(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Subject</td><td style="padding:8px 0">${esc(subject)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${esc(message)}</td></tr>
        </table>
      </div>
    `
    const text = `New message from ${name} <${email}>\nSubject: ${subject}\n\n${message}`

    try {
      const result = await resend.emails.send({
        from: FROM,
        to: TO,
        subject,
        html,
        text,
        reply_to: [email], // set array agar kompatibel semua versi
      } as any)

      if ((result as any)?.error) {
        console.error('[contact] resend error:', (result as any).error)
        return res.status(500).json({ ok: false, error: (result as any).error?.message || 'Send failed' })
      }
    } catch (e: any) {
      console.error('[contact] exception:', e)
      return res.status(500).json({ ok: false, error: e?.message || 'Send failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('[contact] unhandled:', err)
    return res.status(500).json({ ok: false, error: err?.message || 'Internal error' })
  }
}