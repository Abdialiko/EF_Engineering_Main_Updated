'use client'
import { useEffect, useState, useRef } from 'react'
import PageHeader from '../../../components/PageHeader'
import Reveal from '../../../components/Reveal'
import VacancyApplicationForm from '../../../components/VacancyApplicationForm'
import { fetchApi } from '../../../lib/api'
import { formatJobDate } from '../../../lib/jobContent'
import { HiOutlineClipboardDocumentCheck, HiOutlineCalendar, HiOutlineMapPin, HiOutlineBriefcase, HiOutlineBuildingOffice, HiOutlineClock } from 'react-icons/hi2'
import { useParams } from 'next/navigation'

export default function VacancyApplication() {
  const params = useParams()
  const id = params?.id
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchApi(`jobs/${id}`, { cache: 'no-store' }, 0, false)
        setJob(Array.isArray(data) ? data[0] : (data?.data || data))
      } catch (error) {
        console.error('Failed to load job application:', error)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadJob()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 engineering-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F54927] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading application form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      </div>

      <PageHeader title="Job Application" />
      <main className="responsive-container py-4 md:py-6 lg:py-8 relative z-10">
        {/* Layout: Form Left + Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Main Content - Application Form (Left) */}
          <div className="lg:col-span-9 order-1" ref={formRef}>
            {/* Multi-Step Application Form */}
            <div className="w-full">
              <VacancyApplicationForm jobId={Array.isArray(id) ? id[0] : id} jobTitle={job?.title} />
            </div>
          </div>

          {/* Right Sidebar - Sticky Job Info Panel */}
          <aside className="lg:col-span-3 space-y-3 order-2 min-w-0 lg:sticky lg:top-24 lg:self-start">
            {/* Apply Now Card - Interactive */}
            <Reveal variant="up" delay={0}>
              <div 
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#F54927]/20 rounded-lg p-3 shadow-md"
                role="button"
                tabIndex={0}
                aria-label="Scroll to application form"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (formRef.current) {
                      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#F54927] rounded-full animate-pulse"></div>
                  <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs">Apply Now</p>
                  <div className="w-2 h-2 bg-[#F54927] rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900 mb-2 leading-tight text-center break-words">
                  Application for{' '}
                  <span className="text-[#042970] relative gradient-text inline-block">
                    {job?.title || 'Position'}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F54927]"></span>
                  </span>
                </h1>
                <p className="text-gray-700 text-xs leading-relaxed text-center">
                  Fill out the form below to apply for this position. All required fields are marked with an asterisk (*). 
                  We'll review your application and get back to you soon.
                </p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                    <span className="hidden lg:inline">View application form</span>
                    <span className="lg:hidden">Scroll to form</span>
                    <svg className="w-3 h-3 animate-bounce lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <svg className="w-3 h-3 hidden lg:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Position Details Card */}
            <div className="bg-gradient-to-br from-[#042970] to-[#0a1a3a] text-white border border-[#042970] rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
                <h3 className="text-sm font-bold">Position Details</h3>
              </div>
              {job && (
                <div className="space-y-2">
                  <div className="p-2 bg-white/10 rounded-md">
                    <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1">Job Title</h4>
                    <p className="text-sm font-semibold break-words">{job.title}</p>
                  </div>
                  
                  {job.department && (
                    <div className="p-2 bg-white/10 rounded-md">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                        <HiOutlineBuildingOffice className="w-3 h-3" />
                        Department
                      </h4>
                      <p className="text-xs font-medium">{job.department}</p>
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
                      {job.remote && (
                        <span className="inline-block mt-1.5 px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981] text-[10px] font-semibold rounded">
                          Remote/Hybrid Available
                        </span>
                      )}
                    </div>
                  )}
                  
                  {job.posted_date && (
                    <div className="p-2 bg-white/10 rounded-md">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                        <HiOutlineClock className="w-3 h-3" />
                        Posted Date
                      </h4>
                      <p className="text-xs font-medium">
                        {formatJobDate(job.posted_date)}
                      </p>
                    </div>
                  )}
                  
                  {job.deadline && (
                    <div className="p-2 bg-white/10 rounded-md">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1">
                        <HiOutlineCalendar className="w-3 h-3" />
                        Application Deadline
                      </h4>
                      <p className="text-xs font-medium">
                        {formatJobDate(job.deadline)}
                      </p>
                    </div>
                  )}
                  
                  {job.salary_range && (
                    <div className="p-2 bg-white/10 rounded-md">
                      <h4 className="text-[10px] uppercase tracking-wider text-white/70 mb-1">Salary Range</h4>
                      <p className="text-xs font-medium">{job.salary_range}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-white/80 leading-relaxed">
                  Need help? Contact us at{' '}
                  <a 
                    href="mailto:info@efengineering.com" 
                    className="text-white font-semibold underline break-all"
                    aria-label="Contact us via email"
                  >
                    info@efengineering.com
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
