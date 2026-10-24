import { fetchApi } from './api'
import { jobSlug, unwrapJob } from './jobContent'

export function friendlyJobError(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (/timeout/i.test(message)) {
    return 'The server took too long to respond. Please try again.'
  }
  if (/failed to fetch|network|abort/i.test(message)) {
    return 'We could not reach the server. Check your connection and try again.'
  }
  return 'We could not load this vacancy right now. Please try again in a moment.'
}

/**
 * Load one vacancy by numeric id or by a title slug.
 * The single-job endpoint is tried first. A slug, or an id the detail
 * endpoint does not recognize, is matched against the live jobs list.
 */
export async function loadJobByKey(key: string): Promise<any | null> {
  const normalized = decodeURIComponent(key).replace(/\.html$/i, '').trim()
  if (!normalized) return null

  let lookupError: unknown = null
  try {
    const direct = unwrapJob(
      await fetchApi(`jobs/${encodeURIComponent(normalized)}`, { cache: 'no-store' }, 0, false)
    )
    if (direct?.id !== undefined && direct?.id !== null) return direct
  } catch (error) {
    lookupError = error
  }

  try {
    const listPayload = await fetchApi('jobs', { cache: 'no-store' }, 0, false)
    const jobs = Array.isArray(listPayload) ? listPayload : []
    const slug = jobSlug(normalized)
    const match = jobs.find((job: any) => {
      if (job?.id !== undefined && job?.id !== null && String(job.id) === normalized) return true
      if (job?.slug && jobSlug(String(job.slug)) === slug) return true
      if (job?.title && jobSlug(String(job.title)) === slug) return true
      return false
    })
    if (match) return match
  } catch (error) {
    if (lookupError) throw lookupError
    throw error
  }

  if (lookupError) {
    const message = lookupError instanceof Error ? lookupError.message : ''
    if (!/404|not found/i.test(message)) throw lookupError
  }

  return null
}

export async function loadDepartments(): Promise<Record<string, string>> {
  try {
    const payload = await fetchApi('departments', { cache: 'no-store' }, 0, true)
    const list = Array.isArray(payload) ? payload : []
    const map: Record<string, string> = {}
    list.forEach((item: any) => {
      if (item?.id === undefined || item?.id === null) return
      const name = item.title || item.name
      if (name) map[String(item.id)] = String(name)
    })
    return map
  } catch {
    return {}
  }
}

export async function loadRelatedJobs(currentId: string | number): Promise<any[]> {
  try {
    const payload = await fetchApi('jobs', { cache: 'no-store' }, 0, false)
    const jobs = Array.isArray(payload) ? payload : []
    return jobs.filter((job: any) => String(job?.id) !== String(currentId)).slice(0, 3)
  } catch {
    return []
  }
}
