// api/contact.ts
// Serverless endpoint (Vercel) to receive contact form and send email via Resend.
// Put this file in the project root (not inside src/).

import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema
const schema = z.object({
  name: z.string().min(1, 'Name required').max(80),
  email: z.string().email('Invalid email').max(120),
  subject: z.string().max(140).optional().default('New message from portfolio'),
  message: z.string().min(10, 'Please write at least 10 characters').max(3000),
  // Honeypot field (anti-bot)
  hp: z.string().optional().default(''),
})

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

// Try to parse body from JSON or urlencoded string
function parseBody(body: any) {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      try {
        return Object.fromEntries(new URLSearchParams(body))
      } catch {
        return {}
      }
    }
  }
  return body
}

export default async function handler(req: any, res: any) {
  // Basic CORS (optional: restrict to your domain)
  const allowOrigin = process.env.CONTACT_ALLOWED_ORIGIN || '*'
  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true })
  }

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

    // Honeypot: if filled, silently succeed
    if (hp && hp.trim() !== '') {
      return res.status(200).json({ ok: true })
    }

    const TO = process.env.CONTACT_TO
    const FROM = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>'
    const API = process.env.RESEND_API_KEY

    if (!API || !TO) {
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

    const result = await resend.emails.send({
      from: FROM,
      to: TO.split(',').map((s) => s.trim()),
      subject,
      html,
      text,
      reply_to: email, // set Reply-To so you can reply directly
    } as any)

    if ((result as any)?.error) {
      return res
        .status(500)
        .json({ ok: false, error: (result as any).error?.message || 'Send failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Internal error' })
  }
}