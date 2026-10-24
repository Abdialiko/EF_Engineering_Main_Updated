'use client'
import { useEffect, useState } from 'react'
import { HiOutlineXMark, HiOutlineCalendar, HiOutlineClock, HiOutlineMapPin, HiOutlineBriefcase, HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineLightBulb, HiOutlineRocketLaunch, HiOutlineHeart } from 'react-icons/hi2'
import Link from 'next/link'
import { formatJobDate, jobApplyHref, sanitizeJobHtml } from '../lib/jobContent'

interface VacancyModalProps {
  job: any
  isOpen: boolean
  onClose: () => void
}

export default function VacancyModal({ job, isOpen, onClose }: VacancyModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !job) return null

  const cleanedDescription = sanitizeJobHtml(job?.description || '')

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 min-w-0 ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#042970] to-[#0a1a3a] p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 group"
          >
            <HiOutlineXMark className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="pr-12 sm:pr-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 leading-tight break-words">
              {job.title || 'Position Available'}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
              {job.type && (
                <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm">
                  <HiOutlineBriefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold">{job.type}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm">
                  <HiOutlineMapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold">{job.location}</span>
                </div>
              )}
              {job.deadline && (
                <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm">
                  <HiOutlineCalendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold break-words">Deadline: {formatJobDate(job.deadline)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-10 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Job Overview Section */}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <HiOutlineLightBulb className="w-6 h-6 text-[#F54927]" />
              Role Overview
            </h3>
            <div 
              className="vacancy-content"
              dangerouslySetInnerHTML={{ __html: cleanedDescription }}
            />
          </div>

          {/* Why Apply Section */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#042970]/5 to-[#F54927]/5 rounded-xl border-2 border-[#042970]/10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <HiOutlineHeart className="w-6 h-6 text-[#F54927]" />
              Why Join EF Engineering?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Growth Opportunities</h4>
                  <p className="text-sm text-gray-700">Continuous learning and professional development programs</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <HiOutlineSparkles className="w-5 h-5 text-[#F54927] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Innovative Culture</h4>
                  <p className="text-sm text-gray-700">Work on cutting-edge engineering and architectural projects</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <HiOutlineCheckCircle className="w-5 h-5 text-[#10B981] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Competitive Benefits</h4>
                  <p className="text-sm text-gray-700">Comprehensive benefits package and competitive salary</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <HiOutlineHeart className="w-5 h-5 text-[#F54927] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Team Environment</h4>
                  <p className="text-sm text-gray-700">Collaborative and supportive work environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Close
          </button>
          <Link
            href={jobApplyHref(job.id)}
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#F54927] to-[#d63e1f] hover:from-[#042970] hover:to-[#042970] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl group animated-gradient text-sm sm:text-base"
          >
            Apply Now
            <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

