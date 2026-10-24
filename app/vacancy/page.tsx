"use client"
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchApi } from '../../lib/api'
import { formatJobDate, jobPreviewText } from '../../lib/jobContent'
import { 
  HiOutlineBriefcase, 
  HiOutlineClock, 
  HiOutlineCalendar, 
  HiOutlineArrowRight, 
  HiOutlineCheckBadge, 
  HiOutlineFunnel, 
  HiOutlineXMark, 
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingOffice,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineRocketLaunch,
  HiOutlineHeart
} from 'react-icons/hi2'

export default function Vacancy() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    department: '',
    employmentType: '',
    experienceLevel: '',
    applyNow: false
  })

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('jobs')
        const jobsData = Array.isArray(data) ? data : []
        setJobs(jobsData)
        setFilteredJobs(jobsData)
      } catch (e) {
        console.error('Failed to load jobs:', e)
        setJobs([])
        setFilteredJobs([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let filtered = [...jobs]
    
    if (filters.keyword) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.keyword.toLowerCase())
      )
    }
    
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.department) {
      filtered = filtered.filter(job => 
        job.department?.toLowerCase().includes(filters.department.toLowerCase()) ||
        job.title?.toLowerCase().includes(filters.department.toLowerCase())
      )
    }
    
    if (filters.employmentType) {
      filtered = filtered.filter(job => 
        job.type?.toLowerCase().includes(filters.employmentType.toLowerCase())
      )
    }
    
    if (filters.applyNow) {
      const today = new Date()
      filtered = filtered.filter(job => {
        if (!job.deadline) return false
        const deadline = new Date(job.deadline)
        return deadline >= today
      })
    }
    
    setFilteredJobs(filtered)
  }, [filters, jobs])

  const uniqueTypes = Array.from(new Set(jobs.map(job => job.type).filter(Boolean)))
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location).filter(Boolean)))
  const uniqueDepartments = Array.from(new Set(
    jobs.map(job => job.department || job.title?.split(' ')[0]).filter(Boolean)
  ))

  const clearFilters = () => {
    setFilters({ keyword: '', location: '', department: '', employmentType: '', experienceLevel: '', applyNow: false })
  }

  const hasActiveFilters = filters.keyword || filters.location || filters.department || filters.employmentType || filters.experienceLevel || filters.applyNow



  return (
    <div className="min-h-screen bg-gray-50 engineering-bg overflow-x-hidden">
      <PageHeader title="Current Vacancies" />
      
      {/* Compact Filter Bar - Always Visible */}
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="responsive-container py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <HiOutlineFunnel className="w-5 h-5 text-[#F54927] flex-shrink-0" />
              <h2 className="text-lg font-bold text-gray-900">Filter Positions</h2>
              {hasActiveFilters && (
                <span className="px-3 py-1 bg-[#F54927] text-white text-xs font-bold rounded-full">
                  {filteredJobs.length} results
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-stretch lg:items-center gap-3 w-full lg:w-auto">
              {/* Keyword Search */}
              <div className="relative sm:col-span-2 lg:col-span-1 lg:w-64 min-w-0">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="Search by keyword..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:border-[#F54927] text-sm"
                  aria-label="Search jobs by keyword"
                />
              </div>
              
              {/* Location Filter */}
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full min-w-0 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:border-[#F54927] text-sm bg-white"
                aria-label="Filter by location"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location: string) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              {/* Employment Type Filter */}
              <select
                value={filters.employmentType}
                onChange={(e) => setFilters(prev => ({ ...prev, employmentType: e.target.value }))}
                className="w-full min-w-0 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:border-[#F54927] text-sm bg-white"
                aria-label="Filter by employment type"
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type: string) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              {/* Apply Now Quick Filter */}
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer text-sm w-full sm:w-auto">
                <input
                  type="checkbox"
                  checked={filters.applyNow}
                  onChange={(e) => setFilters(prev => ({ ...prev, applyNow: e.target.checked }))}
                  className="w-4 h-4 text-[#F54927] border-gray-300 rounded focus:ring-[#F54927]"
                  aria-label="Show only open positions"
                />
                <span className="font-semibold text-gray-700">Open Now</span>
              </label>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#F54927] rounded-lg"
                  aria-label="Clear all filters"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="responsive-container py-8 md:py-12">
        {/* Hero Section with Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Side - Why Join Us Card */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Reveal variant="up" delay={100}>
              <div className="bg-gradient-to-br from-[#042970]/5 to-[#F54927]/5 border-2 border-[#042970]/10 rounded-xl p-4 w-full flex flex-col h-full">
                <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                  <HiOutlineHeart className="w-4 h-4 text-[#F54927]" />
                  Why Join Us?
                </h3>
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-start gap-2">
                    <HiOutlineRocketLaunch className="w-4 h-4 text-[#042970] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs mb-0.5">Growth Opportunities</h4>
                      <p className="text-[10px] text-gray-700 leading-tight">Continuous learning and professional development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiOutlineSparkles className="w-4 h-4 text-[#F54927] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs mb-0.5">Innovative Culture</h4>
                      <p className="text-[10px] text-gray-700 leading-tight">Work on cutting-edge engineering projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HiOutlineCheckBadge className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs mb-0.5">Competitive Benefits</h4>
                      <p className="text-[10px] text-gray-700 leading-tight">Comprehensive benefits package</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Center - Hero Section */}
          <div className="lg:col-span-6 order-1 lg:order-2">
        <Reveal variant="up" delay={0}>
              <div className="text-center">
                <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs mb-2">Career Opportunities</p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              Join{' '}
              <span className="text-[#042970] relative gradient-text inline-block">
                Our Team
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h1>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
              Explore exciting career opportunities at EF Engineering. Join a team of passionate professionals dedicated to excellence in engineering and architecture.
            </p>
                
                {/* Job Statistics - Under Description */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-lg flex items-center justify-center">
                      <HiOutlineBriefcase className="text-[#F54927] w-3.5 h-3.5" />
              </div>
                    <div>
                      <div className="text-lg font-extrabold text-gray-900 leading-none">{filteredJobs.length}</div>
                      <p className="text-[10px] text-gray-600 font-semibold">Open Positions</p>
            </div>
          </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#042970]/20 to-[#042970]/10 rounded-lg flex items-center justify-center">
                      <HiOutlineCheckBadge className="text-[#042970] w-3.5 h-3.5" />
                </div>
                    <div>
                      <div className="text-lg font-extrabold text-gray-900 leading-none">50+</div>
                      <p className="text-[10px] text-gray-600 font-semibold">Team Members</p>
              </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-lg flex items-center justify-center">
                      <HiOutlineClock className="text-[#F54927] w-3.5 h-3.5" />
                </div>
                <div>
                      <div className="text-lg font-extrabold text-gray-900 leading-none">10+</div>
                      <p className="text-[10px] text-gray-600 font-semibold">Years Experience</p>
                </div>
                  </div>
                </div>
              </div>
            </Reveal>
              </div>
              
          {/* Right Side - About EF Engineering Card */}
          <div className="lg:col-span-3 order-3">
            <Reveal variant="up" delay={150}>
              <div className="bg-white border-2 border-[#042970]/20 rounded-xl p-4 w-full flex flex-col h-full">
                <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                  <HiOutlineBuildingOffice className="w-4 h-4 text-[#042970]" />
                  About EF Engineering
                </h3>
                <p className="text-xs text-gray-700 mb-2.5 leading-tight">
                  EF Engineering is a leading engineering and architecture firm dedicated to excellence, innovation, and sustainable solutions.
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <HiOutlineUserGroup className="w-4 h-4 text-[#F54927]" />
                    <span><strong>50+</strong> Team Members</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <HiOutlineClock className="w-4 h-4 text-[#042970]" />
                    <span><strong>10+</strong> Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <HiOutlineBriefcase className="w-4 h-4 text-[#F54927]" />
                    <span><strong>100+</strong> Projects Completed</span>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="mt-auto inline-flex items-center gap-1.5 text-[#042970] font-semibold text-xs"
                  aria-label="Learn more about EF Engineering"
                >
                  Learn More
                  <HiOutlineArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
            </Reveal>
          </div>
        </div>

        {/* Job Listings - Directly Under Statistics */}
        <Reveal variant="up" delay={200}>
          <div className="mt-8">
          {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {new Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
          ) : filteredJobs.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {filteredJobs.map((job: any, i: number) => (
                  <Reveal key={job.id} variant="up" delay={Math.min(i, 8) * 40} className="h-full">
                    <article 
                      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col h-full min-h-[240px] overflow-hidden shadow-sm"
                      aria-labelledby={`job-title-${job.id}`}
                    >
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex flex-col gap-2 mb-3 min-w-0">
                          <span className="inline-flex items-center self-start px-2 py-1 text-xs font-semibold rounded-full bg-[#F54927]/10 text-[#F54927]">
                            {job.type || 'Full-time'}
                          </span>
                          <h3 
                            id={`job-title-${job.id}`}
                            className="text-base sm:text-lg font-bold text-gray-900 leading-snug break-words"
                          >
                          {job.title || 'Position Available'}
                        </h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
                          {jobPreviewText(job.description) || 'Open the job details for the full description.'}
                        </p>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-3">
                      {job.deadline && (
                            <div className="flex items-start gap-2 min-w-0">
                              <HiOutlineCalendar className="w-4 h-4 text-[#F54927] flex-shrink-0 mt-0.5" />
                              <span className="font-medium break-words text-xs">{formatJobDate(job.deadline)}</span>
                        </div>
                      )}
                      {job.location && (
                            <div className="flex items-start gap-2 min-w-0">
                              <HiOutlineMapPin className="w-4 h-4 text-[#042970] flex-shrink-0 mt-0.5" />
                              <span className="font-medium break-words text-xs">{job.location}</span>
                        </div>
                      )}
                        </div>
                  </div>
                    
                      <div className="flex flex-col gap-2 pt-3 border-t border-gray-200 mt-auto flex-shrink-0">
                        <Link
                          href={`/vacancy/${job.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:ring-offset-2 text-sm"
                          aria-label={`View details for ${job.title}`}
                      >
                        View Details
                          <HiOutlineArrowRight className="w-4 h-4" />
                        </Link>
                      <Link
                        href={`/application/${job.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F54927] to-[#d63e1f] text-white px-3 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#F54927] focus:ring-offset-2 text-sm"
                          aria-label={`Apply for ${job.title}`}
                      >
                        Apply Now
                          <HiOutlineArrowRight className="w-4 h-4" />
                      </Link>
                  </div>
                    </article>
                  </Reveal>
                ))}
                </div>
          ) : hasActiveFilters ? (
              <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-xl">
                <HiOutlineFunnel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Positions Match Your Filters</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or clear filters to see all available positions.</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-lg font-bold"
                >
                  Clear Filters
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-16 bg-white border-2 border-gray-200 rounded-xl">
                <HiOutlineBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Vacancies Available</h3>
                <p className="text-gray-600 mb-6">Check back later for new career opportunities.</p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#F54927] text-white px-6 py-3 rounded-lg font-bold"
                >
                  Contact Us
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
              </div>
          )}
        </div>
        </Reveal>
      </main>
    </div>
  )
}
