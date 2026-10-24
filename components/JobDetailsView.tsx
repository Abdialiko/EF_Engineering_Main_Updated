'use client'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PageHeader from './PageHeader'
import Reveal from './Reveal'
import { friendlyJobError, loadDepartments, loadJobByKey, loadRelatedJobs } from '../lib/loadJob'
import {
  departmentLabel,
  formatJobDate,
  isJobOpen,
  jobApplyHref,
  jobDetailsHref,
  postedByName,
  sanitizeJobHtml
} from '../lib/jobContent'
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineBuildingOffice,
  HiOutlineSparkles,
  HiOutlineRocketLaunch,
  HiOutlineCheckBadge,
  HiOutlineHeart,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2'

const DETAIL_SECTIONS = [
  { key: 'description', label: 'Job Description' },
  { key: 'requirements', label: 'Requirements & Qualifications' },
  { key: 'responsibilities', label: 'Key Responsibilities' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'skills', label: 'Required Skills' },
  { key: 'benefits', label: 'Benefits' },
  { key: 'experience', label: 'Experience' }
]

export function JobDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 engineering-bg flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F54927] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-semibold">Loading job details...</p>
      </div>
    </div>
  )
}

function JobDetailsMessage({
  title,
  message,
  action
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 engineering-bg">
      <PageHeader title={title} breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vacancy', href: '/vacancy' }]} />
      <main className="responsive-container py-12">
        <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-xl px-4" role="alert">
          <HiOutlineExclamationTriangle className="w-14 h-14 text-[#F54927] mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">{message}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {action}
            <Link
              href="/vacancy"
              className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-lg font-bold"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Back to Open Positions
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function JobDetailActions({
  jobId,
  jobTitle,
  open,
  direction = 'row',
}: {
  jobId: string | number
  jobTitle?: string
  open: boolean
  direction?: 'row' | 'stack'
}) {
  return (
    <div className={direction === 'stack' ? 'flex flex-col gap-2' : 'flex flex-col sm:flex-row gap-3'}>
      {open ? (
        <Link
          href={jobApplyHref(jobId)}
          className="inline-flex w-full flex-1 items-center justify-center gap-2 bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white px-5 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:ring-offset-2 text-sm"
          aria-label={`Apply for ${jobTitle || 'this position'}`}
        >
          Apply Now
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <p className="flex-1 text-sm font-semibold text-gray-600 px-1 py-2">
          Apply Now is unavailable because this vacancy is closed.
        </p>
      )}
      <Link
        href="/vacancy"
        className="inline-flex w-full flex-1 items-center justify-center gap-2 bg-[#042970] text-white px-5 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#042970] focus:ring-offset-2 text-sm"
        aria-label="Back to open positions"
      >
        <HiOutlineArrowLeft className="w-4 h-4" />
        Back to Open Positions
      </Link>
    </div>
  )
}

export function JobDetailsQuery() {
  const search = useSearchParams()
  const jobKey = search.get('id') || search.get('job') || search.get('slug') || ''
  return <JobDetailsView jobKey={jobKey} />
}

export default function JobDetailsView({ jobKey }: { jobKey: string }) {
  const [job, setJob] = useState<any>(null)
  const [relatedJobs, setRelatedJobs] = useState<any[]>([])
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [missing, setMissing] = useState(false)

  const load = useCallback(async () => {
    if (!jobKey) {
      setJob(null)
      setMissing(true)
      setError('')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      setMissing(false)
      const [jobData, departments] = await Promise.all([loadJobByKey(jobKey), loadDepartments()])
      if (!jobData) {
        setJob(null)
        setMissing(true)
        return
      }
      setJob(jobData)
      setDepartment(departmentLabel(jobData, departments))
      setRelatedJobs(await loadRelatedJobs(jobData.id))
    } catch (loadError) {
      setJob(null)
      setMissing(false)
      setError(friendlyJobError(loadError))
    } finally {
      setLoading(false)
    }
  }, [jobKey])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!job?.title) return
    const previous = document.title
    document.title = `${job.title} | EF Engineering`
    return () => {
      document.title = previous
    }
  }, [job?.title])

  if (loading) return <JobDetailsLoading />

  if (error) {
    return (
      <JobDetailsMessage
        title="Unable to Load Vacancy"
        message={error}
        action={
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 bg-[#042970] text-white px-6 py-3 rounded-lg font-bold"
          >
            Try Again
          </button>
        }
      />
    )
  }

  if (missing || !job) {
    return (
      <JobDetailsMessage
        title="Vacancy Unavailable"
        message="This vacancy is no longer available. It may have expired, been filled, or the link may be incorrect."
      />
    )
  }

  const open = isJobOpen(job)
  const poster = postedByName(job)
  const postedOn = job.posted_date || job.created_at
  const seenHtml = new Set<string>()
  const sections = DETAIL_SECTIONS.flatMap((section) => {
    const raw = job[section.key]
    if (typeof raw !== 'string' || !raw.trim()) return []
    if (seenHtml.has(raw.trim())) return []
    seenHtml.add(raw.trim())
    return [{ ...section, html: sanitizeJobHtml(raw) }]
  })

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg overflow-x-hidden">
      <PageHeader
        title="Job Details"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vacancy', href: '/vacancy' }]}
      />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {!open && (
          <div className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-4 text-amber-950" role="status">
            <h2 className="text-base font-extrabold">This vacancy is closed</h2>
            <p className="text-sm mt-1">
              Applications are no longer being accepted. The deadline has passed or the position is no longer active.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 space-y-5 min-w-0">
            <Reveal variant="up" delay={100}>
              <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 lg:px-10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight break-words min-w-0">
                    {job.title || 'Position Available'}
                  </h2>
                  <span className={`inline-flex items-center self-start px-3 py-1 text-xs font-semibold rounded-full ${open ? 'bg-[#10B981]/10 text-[#047857]' : 'bg-amber-100 text-amber-800'}`}>
                    {open ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-600">
                  {job.type && (
                    <div className="flex items-start gap-2 min-w-0">
                      <HiOutlineBriefcase className="w-4 h-4 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span className="font-medium break-words">{job.type}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-start gap-2 min-w-0">
                      <HiOutlineMapPin className="w-4 h-4 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span className="font-medium break-words">{job.location}</span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex items-start gap-2 min-w-0">
                      <HiOutlineCalendar className="w-4 h-4 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span className="font-medium break-words">Deadline: {formatJobDate(job.deadline)}</span>
                    </div>
                  )}
                  {department && (
                    <div className="flex items-start gap-2 min-w-0">
                      <HiOutlineBuildingOffice className="w-4 h-4 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span className="font-medium break-words">Department: {department}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-5 border-t border-gray-200">
                  <JobDetailActions jobId={job.id} jobTitle={job.title} open={open} />
                </div>
              </div>
            </Reveal>

            {sections.map((section) => (
              <Reveal key={section.key} variant="up" delay={150}>
                <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 lg:px-10 shadow-sm overflow-hidden">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{section.label}</h3>
                  <div className="vacancy-content" dangerouslySetInnerHTML={{ __html: section.html }} />
                </div>
              </Reveal>
            ))}

            <Reveal variant="up" delay={250}>
              <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 lg:px-10 shadow-sm">
                <JobDetailActions jobId={job.id} jobTitle={job.title} open={open} />
              </div>
            </Reveal>
          </div>

          <aside className="lg:col-span-3 space-y-4 min-w-0">
            <Reveal variant="up" delay={200}>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm lg:sticky lg:top-24">
                <JobDetailActions jobId={job.id} jobTitle={job.title} open={open} direction="stack" />
                <h3 className="text-sm font-bold text-gray-900 mt-4 mb-3 pb-2 border-b border-gray-200">Job Summary</h3>
                <div className="space-y-2">
                  <div className="pb-2 border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vacancy Reference</div>
                    <div className="text-sm font-medium text-gray-900">{job.id}</div>
                  </div>

                  {postedOn && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Posted Date</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineCalendar className="w-4 h-4 text-[#F54927] flex-shrink-0" />
                        <span className="break-words">{formatJobDate(postedOn)}</span>
                      </div>
                    </div>
                  )}

                  {job.deadline && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Application Deadline</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineClock className="w-4 h-4 text-[#042970] flex-shrink-0" />
                        <span className="break-words">{formatJobDate(job.deadline)}</span>
                      </div>
                    </div>
                  )}

                  {job.type && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employment Type</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineBriefcase className="w-4 h-4 text-[#F54927] flex-shrink-0" />
                        <span className="break-words">{job.type}</span>
                      </div>
                    </div>
                  )}

                  {department && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineBuildingOffice className="w-4 h-4 text-[#042970] flex-shrink-0" />
                        <span className="break-words">{department}</span>
                      </div>
                    </div>
                  )}

                  {job.location && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineMapPin className="w-4 h-4 text-[#042970] flex-shrink-0" />
                        <span className="break-words">{job.location}</span>
                      </div>
                    </div>
                  )}

                  {job.required_amount !== null && job.required_amount !== undefined && job.required_amount !== '' && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Openings</div>
                      <div className="text-sm font-medium text-gray-900">{job.required_amount}</div>
                    </div>
                  )}

                  {job.sex && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Applicant Requirement</div>
                      <div className="text-sm font-medium text-gray-900 break-words">{job.sex}</div>
                    </div>
                  )}

                  {job.salary_range && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Salary Range</div>
                      <div className="text-sm font-medium text-gray-900 break-words">{job.salary_range}</div>
                    </div>
                  )}

                  {poster && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Posted By</div>
                      <div className="text-sm font-medium text-gray-900 break-words">{poster}</div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal variant="up" delay={250}>
              <div className="bg-gradient-to-br from-[#042970]/5 to-[#F54927]/5 border border-[#042970]/10 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <HiOutlineHeart className="w-4 h-4 text-[#F54927]" />
                  Why Join Us?
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <HiOutlineRocketLaunch className="w-4 h-4 text-[#042970] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Growth Opportunities</h4>
                      <p className="text-[10px] text-gray-700">Continuous learning and professional development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiOutlineSparkles className="w-4 h-4 text-[#F54927] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Innovative Culture</h4>
                      <p className="text-[10px] text-gray-700">Work on cutting-edge engineering and architecture projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiOutlineCheckBadge className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Competitive Benefits</h4>
                      <p className="text-[10px] text-gray-700">Comprehensive benefits package</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {relatedJobs.length > 0 && (
              <Reveal variant="up" delay={300}>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">Other Open Positions</h3>
                  <div className="space-y-2">
                    {relatedJobs.map((relatedJob: any) => (
                      <Link
                        key={relatedJob.id}
                        href={jobDetailsHref(relatedJob.id)}
                        className="block p-3 border border-gray-200 rounded-lg hover:border-[#F54927]/40 transition-colors"
                        aria-label={`View ${relatedJob.title || 'position'} details`}
                      >
                        <h4 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-2">
                          {relatedJob.title || 'Position Available'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-gray-600 break-words">
                          {relatedJob.type && <span>{relatedJob.type}</span>}
                          {relatedJob.location && (
                            <>
                              <span aria-hidden="true">•</span>
                              <span className="break-words">{relatedJob.location}</span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
