/** Shared vacancy text helpers so every job uses the same preview and detail markup. */

export function formatJobDate(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

export function jobPreviewText(html?: string | null, max = 160): string {
  if (!html) return ''
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

export function sanitizeJobHtml(html?: string | null): string {
  if (!html || !html.trim()) return '<p>Job description details coming soon.</p>'

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?o:[a-z0-9]+[^>]*>/gi, '')
    .replace(/id="docs-internal-guid-[^"]*"/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/\sclass="[^"]*"/gi, '')
    .replace(/\swidth="[^"]*"/gi, '')
    .replace(/\sheight="[^"]*"/gi, '')
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .replace(/<br\s*\/?>\s*(?:<br\s*\/?>\s*){2,}/gi, '<br><br>')
    .trim()
}

export function jobSlug(value?: string | null): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function jobDetailsHref(id: string | number): string {
  return `/vacancy/details?id=${encodeURIComponent(String(id))}`
}

export function jobApplyHref(id: string | number): string {
  return `/application/apply?id=${encodeURIComponent(String(id))}`
}

function calendarKey(value: string | Date): string {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** A vacancy stays open only while the API marks it active and the deadline has not passed. */
export function isJobOpen(job: { is_active?: unknown; deadline?: string | null } | null | undefined): boolean {
  if (!job) return false
  const active = job.is_active
  if (active === 0 || active === false || active === '0' || active === 'false') return false
  if (job.deadline) {
    const deadlineKey = calendarKey(job.deadline)
    const todayKey = calendarKey(new Date())
    if (deadlineKey && todayKey && deadlineKey < todayKey) return false
  }
  return true
}

export function unwrapJob(payload: unknown): any | null {
  if (!payload || typeof payload !== 'object') return null
  const record = Array.isArray(payload) ? payload[0] : (payload as { job?: unknown }).job || payload
  if (!record || typeof record !== 'object') return null
  const job = record as { id?: unknown; title?: unknown }
  if (job.id === undefined && !job.title) return null
  return job
}

export function departmentLabel(job: any, departments: Record<string, string> = {}): string {
  if (!job) return ''
  if (typeof job.department === 'string' && job.department.trim()) return job.department.trim()
  if (typeof job.department_name === 'string' && job.department_name.trim()) return job.department_name.trim()
  if (job.department_id !== undefined && job.department_id !== null) {
    return departments[String(job.department_id)] || ''
  }
  return ''
}

export function postedByName(job: any): string {
  const user = job?.user
  if (!user || typeof user !== 'object') return ''
  return [user.f_name, user.l_name].filter(Boolean).join(' ').trim()
}
