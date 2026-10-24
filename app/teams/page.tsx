"use client"
import { useEffect, useState, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import Link from 'next/link'
import Image from 'next/image'
import { fetchApi, getImageUrl } from '../../lib/api'
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineEnvelope, HiOutlineUserGroup } from 'react-icons/hi2'

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const itemsPerPage = 6 // Show 6 items per slide

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('teams')
        setTeams(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Failed to load teams:', e)
        setTeams([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    const totalSlides = Math.ceil(teams.length / itemsPerPage)
    if (totalSlides <= 1 || isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000) // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [teams.length, isPaused, itemsPerPage])

  const totalSlides = Math.ceil(teams.length / itemsPerPage)
  const currentTeams = teams.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % totalSlides)
  }

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides)
  }

  const getPhoto = (member: any) => {
    return getImageUrl(member, '/images/hero/home.jpg')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 engineering-bg">
      <PageHeader title="Our Team" />
      <main className="container mx-auto px-4 py-12 md:py-16">
        <Reveal variant="up" delay={0}>
          <div className="text-center mb-12">
            <p className="text-[#F54927] font-bold uppercase tracking-wider text-sm mb-3">
              Professionals
            </p>
            <h1 data-title-animate className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              <span className="relative inline-block">
                Meet{' '}
                <span className="text-[#042970] relative gradient-text inline-block">
                  Our Team
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </span>
            </h1>
            <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
              Experienced professionals dedicated to delivering excellence in every project
            </p>
          </div>
        </Reveal>

        {/* Team Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {new Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-white rounded-2xl shadow-lg animate-pulse" />
            ))}
          </div>
        ) : teams.length ? (
          <div className="relative">
            {/* Carousel Container */}
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Team Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {currentTeams.map((member: any, index: number) => {
                  const photo = getPhoto(member)
                  const name = member.name || `${member.f_name || ''} ${member.m_name || ''} ${member.l_name || ''}`.trim() || 'Team Member'
                  const title = member.role || member.position || member.profession || 'Team Member'
                  const email = member.email || member.email_address || ''

                  return (
                    <Reveal key={member.id || index} variant="up" delay={index * 100}>
                      <Link 
                        href={`/teams/${member.id}`}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 interactive-card-3d group hover:shadow-2xl hover:scale-105 block"
                      >
                        {/* Image Container */}
                        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <Image
                            src={photo}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-white">
                          <h3 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:text-[#F54927] transition-colors">
                            {name}
                          </h3>
                          <p className="text-[#042970] font-semibold text-sm mb-4 group-hover:text-[#F54927] transition-colors">
                            {title}
                          </p>
                          
                          {/* Email */}
                          {email && (
                            <div className="flex items-center gap-2 text-gray-600 text-sm group-hover:text-[#042970] transition-colors">
                              <HiOutlineEnvelope className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{email}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            {totalSlides > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white hover:bg-[#F54927] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group border-2 border-gray-200 hover:border-[#F54927]"
                  aria-label="Previous slide"
                >
                  <HiOutlineChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700 group-hover:text-white transition-colors" />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white hover:bg-[#F54927] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group border-2 border-gray-200 hover:border-[#F54927]"
                  aria-label="Next slide"
                >
                  <HiOutlineChevronRight className="w-6 h-6 lg:w-7 lg:h-7 text-gray-700 group-hover:text-white transition-colors" />
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center items-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-[#F54927] w-8 scale-110'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <Reveal variant="up">
            <div className="text-center py-12">
              <HiOutlineUserGroup className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No team members available at the moment.</p>
            </div>
          </Reveal>
        )}
      </main>
    </div>
  )
}


