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
    .replace(/id="docs-internal-guid-[^"]*"/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/\sclass="[^"]*"/gi, '')
    .replace(/\swidth="[^"]*"/gi, '')
    .replace(/\sheight="[^"]*"/gi, '')
    .replace(/<br\s*\/?>\s*(?:<br\s*\/?>\s*){2,}/gi, '<br><br>')
    .trim()
}
