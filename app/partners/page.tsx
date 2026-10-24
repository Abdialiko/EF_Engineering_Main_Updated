"use client"
import { useEffect, useState, useRef } from 'react'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import apiCall from '../../lib/apiCall'
import validate from '../../lib/contactValidation'
import { HiOutlineHandRaised, HiOutlineBuildingOffice2, HiOutlineCheckBadge, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineRocketLaunch, HiOutlineStar, HiOutlineLightBulb, HiOutlineTrophy, HiOutlineUsers, HiOutlinePaperAirplane, HiOutlineCheckCircle } from 'react-icons/hi2'
import { fetchApi } from '../../lib/api'

const formatImageUrl = (imagePath?: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/api/')) return `https://api.efengineering-architect.com${imagePath}`;
  if (imagePath.startsWith('/')) return `https://api.efengineering-architect.com${imagePath}`;
  return `https://api.efengineering-architect.com/api/${imagePath}`;
};

export default function Partners() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const autoScrollId = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    service_id: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    message: '',
    notify: ''
  })
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('clients')
        const partnersData = Array.isArray(data) ? data : []
        setPartners(partnersData.filter((c: any) => (c.category || '').toLowerCase() === 'partner'))
      } catch (e) {
        console.error('Failed to load partners:', e)
        setPartners([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response: any = await apiCall.get('services')
        if (response.status === 200) {
          setServices(Array.isArray(response.data) ? response.data : response.data?.data || [])
        }
      } catch (err) {
        console.error('Error fetching services:', err)
      }
    }
    fetchServices()
  }, [])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    let processedValue = value
    if (name === 'phone_no') {
      processedValue = value.replace(/\D/g, '').substring(0, 10)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    if (value && formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setFormErrors(prev => ({ ...prev, notify: '' }))
    
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
        return
      }
      
    setIsFormLoading(true)
    
    try {
      const response = await apiCall.post('contacts', formData)
      
      if (response.status === 201 || response.status === 200) {
        setFormData({
          name: '',
          email: '',
          phone_no: '',
          address: '',
          service_id: '',
          message: ''
        })
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        setFormErrors(prev => ({
          ...prev,
          notify: 'Failed to send message. Please try again.'
        }))
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error)
      
      let errorMessage = 'Failed to send message. Please try again.'
      
      if (error.response) {
        const responseData = error.response.data
        const status = error.response.status
        
        if (status === 422) {
          if (responseData?.errors) {
            const validationErrors = Object.values(responseData.errors).flat()
            errorMessage = validationErrors.length > 0 ? validationErrors.join(', ') : 'Validation error. Please check all fields.'
          } else {
            errorMessage = responseData?.message || 'Validation error. Please check all fields.'
          }
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later or contact us directly.'
        } else {
          errorMessage = responseData?.message || responseData?.error || `Server error (${status}). Please try again.`
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
      }
      
      setFormErrors(prev => ({
        ...prev,
        notify: errorMessage
      }))
    } finally {
      setIsFormLoading(false)
    }
  }

  const startAutoScroll = () => {
    if (autoScrollId.current !== null) {
      cancelAnimationFrame(autoScrollId.current)
    }
    if (partners.length === 0 || isPaused) return
    
    const scrollContainer = scrollerRef.current
    if (!scrollContainer) {
      setTimeout(startAutoScroll, 100)
        return
      }
      
    const scrollSpeed = 1.3
      let lastTime = performance.now()
    let scrollPosition = scrollContainer.scrollLeft
      
      const animate = (currentTime: number) => {
      if (!scrollContainer || partners.length === 0 || isPaused) {
        if (autoScrollId.current !== null) {
          cancelAnimationFrame(autoScrollId.current)
          autoScrollId.current = null
        }
        return
        }
        
        const elapsed = currentTime - lastTime
        lastTime = currentTime
        
      const frameTime = Math.min(elapsed, 16.67)
      const scrollAmount = scrollSpeed * (frameTime / 16.67)
      scrollPosition += scrollAmount
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      if (scrollPosition >= maxScroll - 10) {
        scrollPosition = scrollPosition - maxScroll
        scrollContainer.scrollLeft = scrollPosition
          } else {
        scrollContainer.scrollLeft = scrollPosition
        }
        
        autoScrollId.current = requestAnimationFrame(animate)
      }
      
      autoScrollId.current = requestAnimationFrame(animate)
  }

  const stopAutoScroll = () => {
    if (autoScrollId.current !== null) {
      cancelAnimationFrame(autoScrollId.current)
      autoScrollId.current = null
    }
  }

  useEffect(() => {
    if (partners.length > 0 && !loading) {
      const startTimer = setTimeout(() => {
        if (scrollerRef.current) {
          scrollerRef.current.scrollLeft = 0
          if (!isPaused) {
              startAutoScroll()
            }
        }
      }, 500)
      
      const handleResize = () => {
        stopAutoScroll()
        setTimeout(() => {
          if (partners.length > 0 && !isPaused && scrollerRef.current) {
            startAutoScroll()
          }
        }, 300)
      }
      
      if (!isPaused && scrollerRef.current) {
        startAutoScroll()
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        clearTimeout(startTimer)
        window.removeEventListener('resize', handleResize)
        stopAutoScroll()
      }
    }
    return () => {
      stopAutoScroll()
    }
  }, [partners.length, loading, isPaused])

  const handleMouseEnter = () => {
    setIsPaused(true)
    stopAutoScroll()
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
    if (partners.length > 0 && scrollerRef.current) {
      setTimeout(() => {
        if (!isPaused && scrollerRef.current) {
          startAutoScroll()
        }
      }, 200)
    }
  }

  const scrollByAmount = (direction: number) => {
    const el = scrollerRef.current
    if (!el || partners.length === 0) return
    
    stopAutoScroll()
    setIsPaused(true)
    
    const cardWidth = 160
    const gap = 32
    const scrollDistance = (cardWidth + gap) * (direction > 0 ? 1 : -1)
    
    el.scrollBy({ left: scrollDistance, behavior: 'smooth' })
    
    setTimeout(() => {
      setIsPaused(false)
      if (partners.length > 0 && !isPaused) {
        startAutoScroll()
      }
    }, 3000)
  }

  const duplicatedPartners = partners.length > 0 ? [...partners, ...partners, ...partners] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F54927]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#042970]/5 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#F54927]/5 to-[#042970]/5 rounded-full blur-3xl"></div>
      </div>

      <PageHeader title="Our Partners" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 relative z-20 inline-block group cursor-default">
            <span className="bg-gradient-to-r from-[#F54927] via-[#042970] to-[#F54927] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift hover:scale-105 transition-transform duration-300 inline-block">
              Our Partners
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#F54927] to-[#042970] group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </h1>
          <Reveal>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 title-scroll-reveal relative z-20">
              Strategic{' '}
              <span className="text-[#042970] relative gradient-text">
                Alliances
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-3 relative z-20">
              Strategic partnerships that enable us to deliver comprehensive solutions. Together, we build stronger, more innovative projects.
            </p>
          </Reveal>
          </div>

        {/* Partner Statistics */}
        <Reveal variant="up" delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div className="standard-card interactive-card-3d p-3 sm:p-4 text-center bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-transparent hover:border-[#F54927] transition-all duration-500">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-lg flex items-center justify-center mx-auto mb-2 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float">
                <HiOutlineHandRaised className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '20px', height: '20px', fontWeight: 'bold' }} />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">{partners.length}+</div>
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Active Partners</p>
            </div>
            <div className="standard-card interactive-card-3d p-3 sm:p-4 text-center bg-gradient-to-br from-white via-[#042970]/5 to-white border-2 border-transparent hover:border-[#042970] transition-all duration-500">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#042970]/20 to-[#042970]/10 rounded-lg flex items-center justify-center mx-auto mb-2 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float">
                <HiOutlineBuildingOffice2 className="text-[#042970] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '20px', height: '20px', fontWeight: 'bold' }} />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">50+</div>
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Collaborative Projects</p>
            </div>
            <div className="standard-card interactive-card-3d p-3 sm:p-4 text-center bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-transparent hover:border-[#F54927] transition-all duration-500">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-lg flex items-center justify-center mx-auto mb-2 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float">
                <HiOutlineCheckBadge className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '20px', height: '20px', fontWeight: 'bold' }} />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">100%</div>
              <p className="text-gray-600 text-xs sm:text-sm font-semibold">Trust & Reliability</p>
            </div>
          </div>
        </Reveal>

        {/* Auto-Scrolling Carousel Container */}
        {loading ? (
          <div className="flex gap-4 md:gap-6 lg:gap-8 py-6 px-4 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={`loading-${idx}`}
                className="flex-none w-[120px] md:w-[140px] lg:w-[160px] h-[120px] md:h-[140px] lg:h-[160px] bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : partners.length > 0 ? (
          <div 
            ref={containerRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Left Arrow - Centered Vertically */}
              <button 
                onClick={() => scrollByAmount(-1)} 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white shadow-xl hover:bg-[#042970] hover:text-white rounded-full transition-all duration-300 hover:scale-110 group border-2 border-gray-200 hover:border-[#042970]"
                aria-label="Scroll left"
              >
              <HiOutlineChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-transform group-hover:-translate-x-1" />
              </button>

            {/* Right Arrow - Centered Vertically */}
              <button 
                onClick={() => scrollByAmount(1)} 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#F54927] text-white shadow-xl hover:bg-[#042970] rounded-full transition-all duration-300 hover:scale-110 group border-2 border-[#F54927] hover:border-[#042970]"
                aria-label="Scroll right"
              >
              <HiOutlineChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" />
              </button>

            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>

          <div
            ref={scrollerRef}
              className="overflow-x-auto scrollbar-hide px-12 md:px-16"
            style={{ 
                scrollSnapType: 'none',
              WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'auto'
              }}
            >
              <div className="flex items-center gap-4 md:gap-6 lg:gap-8 py-6 px-4" style={{ minWidth: 'max-content' }}>
                {duplicatedPartners.map((partner, idx) => {
                  const baseIndex = idx % partners.length
                  const src = formatImageUrl(partner.logo_url || partner.logo)
                  const name = partner.name || partner.title || 'Partner'
                  const isHovered = hoveredIndex === idx
                
                return (
                  <div 
                      key={`partner-${partner.id || baseIndex}-${idx}`}
                    className="flex-none transition-all duration-500 ease-out"
                    style={{
                      scrollSnapAlign: 'center',
                      scrollSnapStop: 'always'
                    }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div 
                      className={`
                          w-[120px] md:w-[140px] lg:w-[160px] 
                          h-[120px] md:h-[140px] lg:h-[160px]
                        rounded-xl overflow-hidden relative
                        transition-all duration-500 ease-out
                          bg-white shadow-md
                          ${isHovered 
                            ? 'shadow-xl scale-110 border-2 border-[#042970] ring-2 ring-[#042970]/30' 
                            : 'hover:shadow-lg hover:scale-105 border border-gray-200'
                          }
                        `}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${
                          isHovered 
                            ? 'opacity-100 from-[#F54927]/10 via-[#042970]/10 to-[#F54927]/5' 
                            : 'opacity-0'
                        }`}></div>

                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/20 to-[#F54927]/20 blur-lg -z-10"></div>
                        )}

                        {src ? (
                          <div className="relative w-full h-full flex items-center justify-center p-3 md:p-4 lg:p-5">
                            <img 
                              src={src} 
                              alt={name} 
                              className={`w-full h-full object-contain transition-all duration-500 ${
                                isHovered ? 'scale-110 brightness-110' : 'scale-100'
                              }`}
                        onError={(e: any) => {
                          (e.target as HTMLImageElement).src = '/images/logo/newlogo.png'
                        }}
                              loading={idx < 20 ? "eager" : "lazy"}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium px-2 text-center">
                            {name}
                          </div>
                        )}

                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                        )}

                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] animate-shine pointer-events-none"></div>
                      )}
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
                </div>
          ) : (
            <Reveal variant="up">
            <div className="text-center py-12 sm:py-16 md:py-20">
                <HiOutlineHandRaised className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3">No Partners Found</h3>
                <p className="text-gray-600 text-sm sm:text-base">Check back later for our partner network.</p>
              </div>
            </Reveal>
          )}

        {/* Key Benefits Section */}
          <Reveal variant="up" delay={300}>
          <div className="mt-16 md:mt-20 mb-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
                Partnership{' '}
                <span className="text-[#042970] relative gradient-text">
                  Benefits
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Discover why leading organizations choose to partner with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: HiOutlineUsers,
                  title: 'Mutual Growth',
                  description: 'Collaborative partnerships that drive growth for both organizations',
                  stat: '50+',
                  statLabel: 'Partners'
                },
                {
                  icon: HiOutlineChartBar,
                  title: 'Shared Resources',
                  description: 'Access to combined expertise, technology, and market insights',
                  stat: '2X',
                  statLabel: 'Capability'
                },
                {
                  icon: HiOutlineRocketLaunch,
                  title: 'Innovation Hub',
                  description: 'Joint R&D initiatives creating cutting-edge solutions',
                  stat: '100+',
                  statLabel: 'Innovations'
                },
                {
                  icon: HiOutlineStar,
                  title: 'Market Expansion',
                  description: 'Expand your reach through our established network and reputation',
                  stat: '30+',
                  statLabel: 'Markets'
                },
                {
                  icon: HiOutlineLightBulb,
                  title: 'Knowledge Exchange',
                  description: 'Continuous learning and best practice sharing between partners',
                  stat: '24/7',
                  statLabel: 'Support'
                },
                {
                  icon: HiOutlineTrophy,
                  title: 'Win-Win Outcomes',
                  description: 'Partnerships designed for mutual success and long-term value',
                  stat: '95%',
                  statLabel: 'Success Rate'
                }
              ].map((benefit, idx) => (
                <Reveal key={idx} variant="up" delay={400 + idx * 100}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#042970] transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#042970]/10 to-[#F54927]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="w-7 h-7 text-[#042970] group-hover:text-[#F54927] transition-colors" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl md:text-3xl font-extrabold text-[#F54927]">{benefit.stat}</div>
                        <div className="text-xs text-gray-500 font-medium">{benefit.statLabel}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Trust Value & Collaboration Impact Section */}
        <Reveal variant="up" delay={600}>
          <div className="mt-16 md:mt-20 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Trust Value */}
              <div className="bg-gradient-to-br from-[#042970] to-[#042970]/90 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10">
                  <HiOutlineShieldCheck className="w-12 h-12 mb-4 text-[#F54927]" />
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Trust & Reliability</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Our partners trust us because we deliver on our promises:
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Transparent partnership agreements',
                      'Fair profit sharing and mutual benefits',
                      'Long-term commitment and support',
                      'Open communication and collaboration'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Collaboration Impact */}
              <div className="bg-gradient-to-br from-[#F54927] to-[#F54927]/90 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
                <div className="relative z-10">
                  <HiOutlineRocketLaunch className="w-12 h-12 mb-4 text-[#042970]" />
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Collaboration Impact</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Together, we achieve remarkable results:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: '200+', label: 'Joint Projects' },
                      { value: '50%', label: 'Faster Delivery' },
                      { value: '3X', label: 'Market Reach' },
                      { value: '100%', label: 'Partner Satisfaction' }
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                        <div className="text-3xl font-extrabold mb-1">{metric.value}</div>
                        <div className="text-xs text-white/80">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Real Business Results */}
        <Reveal variant="up" delay={800}>
          <div className="mt-16 md:mt-20 mb-12">
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-gray-100">
              <div className="text-center mb-8">
                <HiOutlineChartBar className="w-16 h-16 text-[#042970] mx-auto mb-4" />
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                  Real{' '}
                  <span className="text-[#F54927]">Business Results</span>
                </h3>
                <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
                  Our partnerships deliver measurable outcomes that drive success for all stakeholders
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Revenue Growth',
                    description: 'Partners report average revenue increase of 40% within first year',
                    impact: '40%',
                    impactLabel: 'Revenue Increase'
                  },
                  {
                    title: 'Market Expansion',
                    description: 'Access to new markets and customer segments through partnership network',
                    impact: '30+',
                    impactLabel: 'New Markets'
                  },
                  {
                    title: 'Innovation Rate',
                    description: 'Faster time-to-market with collaborative innovation and shared resources',
                    impact: '2X',
                    impactLabel: 'Faster Innovation'
                  }
                ].map((result, idx) => (
                  <div key={idx} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#042970] transition-all duration-300 hover:shadow-lg">
                    <div className="text-4xl font-extrabold text-[#F54927] mb-2">{result.impact}</div>
                    <div className="text-sm text-gray-500 mb-3">{result.impactLabel}</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{result.title}</h4>
                    <p className="text-gray-600 text-sm">{result.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mini Contact Form */}
        <Reveal variant="up" delay={1000}>
          <div className="mt-16 md:mt-20 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                  Become a{' '}
                  <span className="text-[#042970] relative gradient-text">
                    Partner
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                  </span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                  Join our network of trusted partners and unlock new opportunities for growth. Send us a message to explore partnership possibilities.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: HiOutlineCheckBadge, text: 'Mutual growth and shared success' },
                    { icon: HiOutlineCheckBadge, text: 'Access to our network and resources' },
                    { icon: HiOutlineCheckBadge, text: 'Flexible partnership models' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-[#042970] flex-shrink-0" />
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:sticky lg:top-24">
                <Reveal variant="right" delay={1100}>
                  <div className="relative group h-full flex flex-col">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#F54927] via-[#ff6b4a] to-[#042970] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    
                    <div className="relative p-4 sm:p-5 md:p-6 bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 shadow-2xl hover:shadow-[#F54927]/20 transition-all duration-500 flex-1 flex flex-col">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F54927]/5 to-transparent rounded-full -mr-12 -mt-12"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#042970]/5 to-transparent rounded-full -ml-10 -mb-10"></div>
                      
                      <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                          <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-[#F54927] to-[#042970] rounded-full"></div>
                          <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1">
                              Partner{' '}
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54927] to-[#ff6b4a]">With Us</span>
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Tell us about your organization and partnership goals
                            </p>
                          </div>
                        </div>
                        
                        {showSuccess && (
                          <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5 border-2 border-[#10B981] rounded-xl animate-fade-in shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center flex-shrink-0">
                                <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-[#10B981] font-bold text-sm">Success!</p>
                                <p className="text-[#10B981]/80 text-xs">We'll get back to you soon.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {formErrors.notify && (
                          <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-[#F54927]/10 to-[#F54927]/5 border-2 border-[#F54927] rounded-xl animate-shake shadow-lg">
                            <p className="text-[#F54927] font-bold text-sm">{formErrors.notify}</p>
                          </div>
                        )}

                        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="group/field">
                              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                                Your Name <span className="text-[#F54927]">*</span>
                              </label>
                              <input 
                                type="text" 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white ${
                                  formErrors.name 
                                    ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                                    : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                                }`}
                                placeholder="John Doe"
                              />
                              {formErrors.name && (
                                <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{formErrors.name}</p>
                              )}
                            </div>
                            <div className="group/field">
                              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                                Your Email <span className="text-[#F54927]">*</span>
                              </label>
                              <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white ${
                                  formErrors.email 
                                    ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                                    : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                                }`}
                                placeholder="john@example.com"
                              />
                              {formErrors.email && (
                                <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{formErrors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="group/field">
                              <label htmlFor="phone_no" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                                Phone Number <span className="text-[#F54927]">*</span>
                              </label>
                              <input 
                                type="tel" 
                                id="phone_no"
                                name="phone_no"
                                value={formData.phone_no}
                                onChange={handleFormChange}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white ${
                                  formErrors.phone_no 
                                    ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                                    : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                                }`}
                                placeholder="0912345678"
                                maxLength={10}
                              />
                              {formErrors.phone_no && (
                                <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{formErrors.phone_no}</p>
                              )}
                            </div>
                            <div className="group/field">
                              <label htmlFor="address" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                                Address
                              </label>
                              <input 
                                type="text" 
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 focus:border-[#F54927] transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white hover:border-[#042970]/30"
                                placeholder="Your Address"
                              />
                            </div>
                          </div>

                          <div className="group/field">
                            <label htmlFor="service_id" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                              Services
                            </label>
                            <select
                              id="service_id"
                              name="service_id"
                              value={formData.service_id}
                              onChange={handleFormChange}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F54927]/20 focus:border-[#F54927] transition-all duration-300 text-sm sm:text-base bg-gray-50 hover:bg-white hover:border-[#042970]/30 cursor-pointer"
                            >
                              <option value="" disabled>Select a Service</option>
                              {services.length > 0 && 
                                services.map(service => (
                                  <option key={service.id} value={service.id}>
                                    {service.title || service.name}
                                  </option>
                                ))
                              }
                              <option value="">Other</option>
                            </select>
                          </div>

                          <div className="group/field">
                            <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 group-hover/field:text-[#F54927] transition-colors">
                              Message <span className="text-[#F54927]">*</span>
                            </label>
                            <textarea 
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleFormChange}
                              rows={4}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none text-sm sm:text-base bg-gray-50 hover:bg-white ${
                                formErrors.message 
                                  ? 'border-[#F54927] focus:ring-[#F54927]/20 focus:border-[#F54927]' 
                                  : 'border-gray-200 focus:ring-[#F54927]/20 focus:border-[#F54927] hover:border-[#042970]/30'
                              }`}
                              placeholder="Tell us about your partnership goals..."
                            ></textarea>
                            {formErrors.message && (
                              <p className="mt-1.5 text-xs text-[#F54927] font-semibold animate-fade-in">{formErrors.message}</p>
                            )}
                          </div>

                          <div className="pt-2 sm:pt-3 mt-auto">
                            <button 
                              type="submit" 
                              disabled={isFormLoading}
                              className="w-full px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#F54927] via-[#ff6b4a] to-[#F54927] text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-black inline-flex items-center justify-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
                            >
                              <span className="absolute inset-0 bg-gradient-to-r from-[#042970] to-[#0a3a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              {isFormLoading ? (
                                <>
                                  <span className="animate-spin inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white border-t-transparent rounded-full relative z-10"></span>
                                  <span className="relative z-10">Sending...</span>
                                </>
                              ) : (
                                <>
                                  <span className="relative z-10">Send Message</span>
                                  <HiOutlinePaperAirplane className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
        </div>
          </Reveal>
      </main>
    </div>
  )
}
