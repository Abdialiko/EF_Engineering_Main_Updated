'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PageHeader from './PageHeader'
import Reveal from './Reveal'
import VacancyApplicationForm from './VacancyApplicationForm'
import { friendlyJobError, loadDepartments, loadJobByKey } from '../lib/loadJob'
import { departmentLabel, formatJobDate, isJobOpen, jobDetailsHref } from '../lib/jobContent'
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice,
  HiOutlineClock,
  HiOutlineArrowLeft,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2'

function ApplicationLoading() {
  return (
    <div className="min-h-screen bg-gray-50 engineering-bg flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F54927] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-semibold">Loading application form...</p>
      </div>
    </div>
  )
}

export function JobApplicationQuery() {
  const search = useSearchParams()
  const jobKey = search.get('id') || search.get('job') || search.get('slug') || ''
  return <JobApplicationPage jobKey={jobKey} />
}

export default function JobApplicationPage({ jobKey }: { jobKey: string }) {
  const [job, setJob] = useState<any>(null)
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [missing, setMissing] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

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
    } catch (loadError) {
      setJob(null)
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
    document.title = `Apply for ${job.title} | EF Engineering`
    return () => {
      document.title = previous
    }
  }, [job?.title])

  if (loading) return <ApplicationLoading />

  if (error || missing || !job) {
    return (
      <div className="min-h-screen bg-gray-50 engineering-bg">
        <PageHeader title="Job Application" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vacancy', href: '/vacancy' }]} />
        <main className="responsive-container py-12">
          <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-xl px-4" role="alert">
            <HiOutlineExclamationTriangle className="w-14 h-14 text-[#F54927] mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              {error ? 'Unable to Open Application' : 'Vacancy Unavailable'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              {error || 'This vacancy is unavailable or the application link is missing a job reference. Choose an open position and apply from its details page.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {error && (
                <button type="button" onClick={load} className="inline-flex items-center gap-2 bg-[#042970] text-white px-6 py-3 rounded-lg font-bold">
                  Try Again
                </button>
              )}
              <Link href="/vacancy" className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-lg font-bold">
                <HiOutlineArrowLeft className="w-5 h-5" />
                Back to Open Positions
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const open = isJobOpen(job)
  const postedOn = job.posted_date || job.created_at

  if (!open) {
    return (
      <div className="min-h-screen bg-gray-50 engineering-bg">
        <PageHeader title="Job Application" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vacancy', href: '/vacancy' }]} />
        <main className="responsive-container py-12">
          <div className="max-w-2xl mx-auto text-center py-16 bg-white border-2 border-amber-300 rounded-xl px-4" role="status">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Applications are closed</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-gray-900">{job.title}</span> is no longer accepting applications.
            </p>
            <p className="text-sm text-gray-500 mb-6">Vacancy reference: {job.id}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={jobDetailsHref(job.id)} className="inline-flex items-center gap-2 bg-[#042970] text-white px-6 py-3 rounded-lg font-bold">
                View Job Details
              </Link>
              <Link href="/vacancy" className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-lg font-bold">
                See Open Positions
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      </div>

      <PageHeader
        title="Job Application"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vacancy', href: '/vacancy' }, { label: job.title, href: jobDetailsHref(job.id) }]}
      />
      <main className="responsive-container py-4 md:py-6 lg:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-9 order-1" ref={formRef}>
            <div className="w-full">
              <VacancyApplicationForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>

          <aside className="lg:col-span-3 space-y-3 order-2 min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Reveal variant="up" delay={0}>
              <div
                onClick={scrollToForm}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#F54927]/20 rounded-lg p-3 shadow-md"
                role="button"
                tabIndex={0}
                aria-label="Scroll to application form"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    scrollToForm()
                  }
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#F54927] rounded-full animate-pulse"></div>
                  <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs">Apply Now</p>
                  <div className="w-2 h-2 bg-[#F54927] rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-tight text-center break-words">
                  Application for{' '}
                  <span className="text-[#042970] relative gradient-text inline-block">
                    {job.title}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F54927]"></span>
                  </span>
                </h2>
                <p className="text-gray-700 text-xs leading-relaxed text-center">
                  Fill out the form below to apply for this position. All required fields are marked with an asterisk (*).
                  We&apos;ll review your application and get back to you soon.
                </p>
                <p className="text-[11px] font-semibold text-[#042970] text-center mt-2">Vacancy reference: {job.id}</p>
              </div>
            </Reveal>

            <div className="bg-gradient-to-br from-[#042970] to-[#0a1a3a] text-white border border-[#042970] rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
                <h3 className="text-sm font-bold">Position Details</h3>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-white/10 rounded-md">
                  <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1">Job Title</h4>
                  <p className="text-sm font-semibold break-words">{job.title}</p>
                </div>
                <div className="p-2 bg-white/10 rounded-md">
                  <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1">Vacancy Reference</h4>
                  <p className="text-xs font-medium">{job.id}</p>
                </div>
                {department && (
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                      <HiOutlineBuildingOffice className="w-3 h-3" />
                      Department
                    </h4>
                    <p className="text-xs font-medium">{department}</p>
                  </div>
                )}
                {job.type && (
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                      <HiOutlineBriefcase className="w-3 h-3" />
                      Employment Type
                    </h4>
                    <p className="text-xs font-medium">{job.type}</p>
                  </div>
                )}
                {job.location && (
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                      <HiOutlineMapPin className="w-3 h-3" />
                      Location
                    </h4>
                    <p className="text-xs font-medium">{job.location}</p>
                  </div>
                )}
                {postedOn && (
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                      <HiOutlineClock className="w-3 h-3" />
                      Posted Date
                    </h4>
                    <p className="text-xs font-medium">{formatJobDate(postedOn)}</p>
                  </div>
                )}
                {job.deadline && (
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                      <HiOutlineCalendar className="w-3 h-3" />
                      Application Deadline
                    </h4>
                    <p className="text-xs font-medium">{formatJobDate(job.deadline)}</p>
                  </div>
                )}
                {job.salary_range && (
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1">Salary Range</h4>
                    <p className="text-xs font-medium">{job.salary_range}</p>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                <Link href={jobDetailsHref(job.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-white underline">
                  <HiOutlineArrowLeft className="w-3.5 h-3.5" />
                  View full job details
                </Link>
                <p className="text-xs text-white/80 leading-relaxed">
                  Need help? Contact us at{' '}
                  <a href="mailto:info@efengineering-architect.com" className="text-white font-semibold underline break-all">
                    info@efengineering-architect.com
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
