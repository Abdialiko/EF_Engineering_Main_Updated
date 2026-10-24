'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '../../../components/PageHeader'
import Reveal from '../../../components/Reveal'
import { fetchApi } from '../../../lib/api'
import { formatJobDate, sanitizeJobHtml } from '../../../lib/jobContent'
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
  HiOutlineHeart
} from 'react-icons/hi2'

/**
 * Job Details Page - Generic and Reusable
 * 
 * This component displays job details for any position regardless of:
 * - Job category (Engineering, Architecture, Management, etc.)
 * - Job level (Entry, Mid, Senior, Executive)
 * - Department or division
 * 
 * All content is dynamically loaded from the API and conditionally rendered.
 * The layout and design remain consistent across all job postings.
 */
export default function JobDetailsPage() {
  const params = useParams()
  const id = params?.id
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedJobs, setRelatedJobs] = useState<any[]>([])

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        const data = await fetchApi(`jobs/${id}`)
        const jobData = Array.isArray(data) ? data[0] : (data?.data || data)
        setJob(jobData)

        // Load related jobs
        const allJobs = await fetchApi('jobs')
        const jobsList = Array.isArray(allJobs) ? allJobs : []
        const related = jobsList
          .filter((j: any) => j.id !== jobData?.id)
          .slice(0, 3)
        setRelatedJobs(related)
      } catch (e) {
        console.error('Failed to load job:', e)
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
          <p className="text-gray-600 text-lg font-semibold">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 engineering-bg">
        <PageHeader title="Job Not Found" />
        <main className="responsive-container py-12">
          <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-xl">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/vacancy"
              className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-lg font-bold"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Back to Open Positions
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const cleanedDescription = sanitizeJobHtml(job.description)
  const cleanedRequirements = job.requirements ? sanitizeJobHtml(job.requirements) : null

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg overflow-x-hidden">
      <PageHeader
        title="Job Details"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Vacancy', href: '/vacancy' }]}
      />
      
      <main className="responsive-container py-6 md:py-10">
        {/* Back Button */}
        <Reveal variant="up" delay={0}>
          <Link
            href="/vacancy"
            className="inline-flex items-center gap-2 text-sm text-[#042970] font-semibold mb-6"
            aria-label="Back to open positions"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Open Positions
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-4 min-w-0">
            {/* Job Title & Basic Info - Matches listing page card style */}
            <Reveal variant="up" delay={100}>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight break-words min-w-0">
                    {job.title || 'Position Available'}
                  </h1>
                  {job.type && (
                    <span className="inline-flex items-center self-start px-3 py-1 text-xs font-semibold rounded-full bg-[#F54927]/10 text-[#F54927]">
                      {job.type}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm text-gray-600">
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
                  {job.department && (
                    <div className="flex items-start gap-2 min-w-0">
                      <HiOutlineBuildingOffice className="w-4 h-4 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span className="font-medium break-words">Department: {job.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Job Description - Matches listing page description style */}
            <Reveal variant="up" delay={150}>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Job Description</h2>
                <div 
                  className="vacancy-content"
                  dangerouslySetInnerHTML={{ __html: cleanedDescription }}
                />
              </div>
            </Reveal>

            {/* Requirements & Qualifications - Generic for all job categories, matches listing style */}
            {cleanedRequirements && (
              <Reveal variant="up" delay={200}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Requirements & Qualifications</h2>
                  <div 
                    className="vacancy-content"
                    dangerouslySetInnerHTML={{ __html: cleanedRequirements }}
                  />
                </div>
              </Reveal>
            )}

            {/* Action Buttons - Matches listing page button styles */}
            <Reveal variant="up" delay={250}>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/application/${job.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white px-4 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:ring-offset-2 text-sm"
                    aria-label={`Apply for ${job.title}`}
                  >
                    Apply Now
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/vacancy"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
                    aria-label="Back to open positions"
                  >
                    <HiOutlineArrowLeft className="w-4 h-4" />
                    Back to Open Positions
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-4 min-w-0">
            {/* Job Summary Card - Matches listing page card style */}
            <Reveal variant="up" delay={200}>
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm lg:sticky lg:top-24">
                <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">Job Summary</h3>
                <div className="space-y-2">
                  {job.posted_date && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Posted Date</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineCalendar className="w-4 h-4 text-[#F54927] flex-shrink-0" />
                        <span className="break-words">{formatJobDate(job.posted_date)}</span>
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
                  
                  {job.location && (
                    <div className="pb-2 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</div>
                      <div className="flex items-start gap-2 min-w-0 text-sm font-medium text-gray-900">
                        <HiOutlineMapPin className="w-4 h-4 text-[#042970] flex-shrink-0" />
                        <span className="break-words">{job.location}</span>
                      </div>
                    </div>
                  )}
                  
                  {job.salary_range && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Salary Range</div>
                      <div className="text-sm font-medium text-gray-900 break-words">{job.salary_range}</div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Why Join Us - Generic company benefits section for all positions */}
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

            {/* Related Jobs - Dynamically shows other open positions regardless of category, matches listing style */}
            {relatedJobs.length > 0 && (
              <Reveal variant="up" delay={300}>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">Other Open Positions</h3>
                  <div className="space-y-2">
                    {relatedJobs.map((relatedJob: any) => (
                      <Link
                        key={relatedJob.id}
                        href={`/vacancy/${relatedJob.id}`}
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

