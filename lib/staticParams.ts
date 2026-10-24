/**
 * IDs for dynamic routes during `output: 'export'`.
 * Next.js can only emit HTML for params known at build time. The lists come
 * from the same public API the pages already use, so current detail URLs are
 * included. Client pages still request fresh records in the browser.
 */

const API_ORIGIN = 'https://api.efengineering-architect.com/api'

function extractList(payload: unknown): Array<{ id?: string | number }> {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: Array<{ id?: string | number }> }).data
  }
  return []
}

export async function generateIdParams(
  resource: string,
  options?: { emptyFallbackId?: string }
): Promise<{ id: string }[]> {
  const url = `${API_ORIGIN}/${resource}`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(
      `Static export could not list ${resource} from ${url} (HTTP ${response.status}). Detail pages were not removed.`
    )
  }

  const payload = await response.json()
  const seen = new Set<string>()
  const params = extractList(payload)
    .map((item) => (item?.id === undefined || item?.id === null ? '' : String(item.id)))
    .filter((id) => id.length > 0 && !id.includes('/'))
    .filter((id) => {
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
    .map((id) => ({ id }))

  if (params.length > 0) return params

  if (options?.emptyFallbackId) {
    return [{ id: options.emptyFallbackId }]
  }

  throw new Error(
    `Static export could not create /${resource}/[id] pages because ${url} returned no records.`
  )
}
