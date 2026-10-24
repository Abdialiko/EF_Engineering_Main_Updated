'use client'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { fetchApi, getImageUrl } from '../../lib/api'
import {
  HiOutlineBuildingOffice2,
  HiOutlineCube,
  HiOutlineMap,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
  HiOutlineDocumentCheck,
  HiOutlineMapPin,
  HiOutlineHomeModern,
  HiOutlineTruck,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineLightBulb,
  HiOutlineCog6Tooth,
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentCheck,
  HiOutlineGlobeAlt,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlinePlayCircle,
  HiOutlineStar,
  HiOutlineRocketLaunch,
  HiOutlineArrowTrendingUp
} from 'react-icons/hi2'

export default function Services() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [servicesMap, setServicesMap] = useState<{ [key: string]: string }>({})
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const getServiceImageUrl = (service: any) => {
    if (!service) return '/images/hero/home.jpg'
    if (service.image_url) return service.image_url
    if (service.image) return service.image
    if (service.photo) return service.photo
    if (Array.isArray(service.photos) && service.photos.length > 0) return service.photos[0]
    if (Array.isArray(service.image_urls) && service.image_urls.length > 0) return service.image_urls[0]
    return '/images/hero/home.jpg'
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('services')
        const servicesArray = Array.isArray(data) ? data : []
        setServices(servicesArray)
        
        // Create mapping of service names to IDs
        const map: { [key: string]: string } = {}
        servicesArray.forEach((service: any) => {
          const title = (service.title || service.name || '').toLowerCase()
          map[title] = `/services/${service.id}`
        })
        setServicesMap(map)
      } catch (e) {
        console.error('Failed to load services:', e)
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const getServiceFromName = (serviceName: string): any => {
    const normalizedName = serviceName.toLowerCase().trim()
    return services.find((service: any) => {
      const serviceTitle = (service.title || service.name || '').toLowerCase().trim()
      // Exact match
      if (serviceTitle === normalizedName) return true
      // Check if service title contains the search name or vice versa
      if (serviceTitle.includes(normalizedName) || normalizedName.includes(serviceTitle)) return true
      // Check for key words match (for partial matches)
      const searchWords = normalizedName.split(/\s+/).filter(w => w.length > 3)
      const titleWords = serviceTitle.split(/\s+/).filter(w => w.length > 3)
      if (searchWords.length > 0 && titleWords.length > 0) {
        const matchingWords = searchWords.filter(word => titleWords.some(tw => tw.includes(word) || word.includes(tw)))
        if (matchingWords.length >= Math.min(2, searchWords.length)) return true
      }
      return false
    })
  }

  const getServiceHref = (serviceName: string): string => {
    if (serviceName.toLowerCase().includes('request for partnership')) {
      return '/contact'
    }
    // First try exact match
    const normalizedName = serviceName.toLowerCase().trim()
    if (servicesMap[normalizedName]) {
      return servicesMap[normalizedName]
    }
    // Then try fuzzy matching
    const matchedService = getServiceFromName(serviceName)
    if (matchedService && matchedService.id) {
      return `/services/${matchedService.id}`
    }
    // Fallback to services page
    return '/services'
  }

  const ourServicesList = [
    'Hydraulic and Water work design',
    'Topographic Surveying and Master plan design',
    'Geotechnical Engineering, Material Testing, and Pavement Design',
    'Infrastructure design and Supervision',
    'Contract Administration and Supervision',
    'Building Architectural and structural design',
    'Preparation of Engineering Cost Estimate',
    'Request for partnership',
  ]

  const whyChooseUs = [
    {
      title: 'Expert Team',
      description: 'Our multidisciplinary team combines international standards with local expertise.',
      icon: HiOutlineAcademicCap
    },
    {
      title: 'Proven Track Record',
      description: 'Successfully delivered 27+ projects across various sectors and scales.',
      icon: HiOutlineStar
    },
    {
      title: 'Modern Technology',
      description: 'Utilizing cutting-edge software and tools for superior results.',
      icon: HiOutlineCog6Tooth
    },
    {
      title: 'Client-Focused',
      description: 'Dedicated to exceeding client expectations and delivering value.',
      icon: HiOutlineRocketLaunch
    }
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Project Initiation & Feasibility Study',
      description: 'We begin with a comprehensive consultation to understand your vision, requirements, and objectives.',
      icon: HiOutlineLightBulb
    },
    {
      step: '02',
      title: 'Concept Development & Design',
      description: 'Our expert team creates detailed designs and plans tailored to your specific needs and budget.',
      icon: HiOutlineBuildingOffice2
    },
    {
      step: '03',
      title: 'Approval & Permits',
      description: 'We handle all regulatory approvals and permit processes to ensure smooth project progression.',
      icon: HiOutlineDocumentCheck
    },
    {
      step: '04',
      title: 'Implementation & Supervision',
      description: 'Professional oversight throughout construction ensuring quality, safety, and timely completion.',
      icon: HiOutlineClipboardDocumentCheck
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-[#F54927]/5 rounded-full continuous-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      </div>

      <PageHeader title="Our Services" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section */}
        <Reveal variant="up" delay={0}>
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">What We Offer</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Comprehensive{' '}
              <span className="text-[#042970] relative gradient-text inline-block">
                Engineering Solutions
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h1>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 px-4">
              We plan, design, and manage projects with a focus on safety, quality, and cost certainty. 
              Our multidisciplinary approach ensures innovative solutions that meet global standards while respecting local context.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <Link href="/contact" className="standard-button bg-[#F54927] hover:bg-[#042970] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50">
                Get a Quote
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-white" />
              </Link>
              <Link href="#services" className="standard-button border-2 border-[#042970] hover:bg-[#042970] hover:text-white text-[#042970] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Explore Services
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Our Services List Section */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <Reveal variant="up" delay={200}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3">
                Our{' '}
                <span className="text-[#F54927] relative gradient-text inline-block">
                  Services
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
                Explore our comprehensive range of engineering and architectural services
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {ourServicesList.map((serviceName, index) => {
              const isHovered = hoveredCard === `service-${index}`
              const serviceHref = getServiceHref(serviceName)
              const isPartnership = serviceName.toLowerCase().includes('request for partnership')
              const matchedService = getServiceFromName(serviceName)
              const serviceImage = matchedService ? getImageUrl(matchedService) : null
              
              return (
                <Reveal key={index} variant="up" delay={300 + index * 50}>
                  <Link 
                    href={serviceHref}
                    onMouseEnter={() => setHoveredCard(`service-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="block group"
                  >
                    <div className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col ${
                      isHovered 
                        ? 'border-[#F54927] shadow-lg scale-[1.02]' 
                        : 'border-gray-200 hover:border-[#042970]/30'
                    }`}>
                      {/* Service Image */}
                      {serviceImage && (
                        <div className="relative w-full h-32 sm:h-40 overflow-hidden">
                          <img 
                            src={serviceImage} 
                            alt={serviceName}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isHovered ? 'scale-110' : 'group-hover:scale-105'
                            }`}
                            loading={index < 6 ? "eager" : "lazy"}
                            onError={(e: any) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      
                      {/* Service Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1">
                          {!serviceImage && (
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isHovered 
                                ? 'bg-[#F54927] scale-110' 
                                : 'bg-[#F54927]/10 group-hover:bg-[#F54927]/20'
                            }`}>
                              <HiOutlineBuildingOffice2 className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                                isHovered ? 'text-white' : 'text-[#F54927]'
                              }`} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm sm:text-base font-bold mb-1 leading-tight transition-colors duration-300 ${
                              isHovered ? 'text-[#F54927]' : 'text-gray-900 group-hover:text-[#042970]'
                            }`}>
                              {serviceName}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                                isHovered ? 'text-[#F54927]' : 'text-[#042970]'
                              }`}>
                                {isPartnership ? 'Contact Us' : 'View Details'}
                              </span>
                              <HiOutlineArrowRight className={`w-4 h-4 transition-all duration-300 ${
                                isHovered ? 'text-[#F54927] translate-x-1' : 'text-gray-400 group-hover:text-[#042970] group-hover:translate-x-1'
                              }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Additional Services - Minimized Cards */}
          <section className="mb-12 sm:mb-16 md:mb-20">
            <Reveal variant="up" delay={700}>
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  Additional{' '}
                <span className="text-[#F54927] relative gradient-text inline-block">
                    Services
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                  </span>
                </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-3xl mx-auto px-4">
                Comprehensive consulting services tailored to your project needs, delivered with expertise and innovation
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Architectural & Engineering Design */}
            <Reveal variant="up" delay={800}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#F54927] hover:shadow-md transition-all">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F54927]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineBuildingOffice2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#F54927]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                      Architectural & Engineering Design
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-2">
                      Comprehensive design services for residential, commercial, and institutional buildings with innovative solutions and sustainable practices.
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Building Design & Planning</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Structural Engineering</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>MEP Systems Design</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="text-[10px] sm:text-xs font-semibold text-[#F54927] hover:text-[#042970] inline-flex items-center gap-1">
                      Learn More
                      <HiOutlineArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Urban Planning & Neighborhood Design */}
            <Reveal variant="up" delay={850}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#042970] hover:shadow-md transition-all">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#042970]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineMap className="w-4 h-4 sm:w-5 sm:h-5 text-[#042970]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                      Urban Planning & Neighborhood Design
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-2">
                      Strategic urban planning and neighborhood development solutions that create sustainable, livable communities.
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Master Planning</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Zoning & Land Use</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Infrastructure Planning</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="text-[10px] sm:text-xs font-semibold text-[#042970] hover:text-[#F54927] inline-flex items-center gap-1">
                      Learn More
                      <HiOutlineArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Construction Management & Supervision */}
            <Reveal variant="up" delay={900}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#F54927] hover:shadow-md transition-all">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F54927]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineWrenchScrewdriver className="w-4 h-4 sm:w-5 sm:h-5 text-[#F54927]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                      Construction Management & Supervision
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-2">
                      Expert oversight and management throughout the construction lifecycle ensuring quality, safety, and timely completion.
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Site Supervision</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Quality Control</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Safety Management</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="text-[10px] sm:text-xs font-semibold text-[#F54927] hover:text-[#042970] inline-flex items-center gap-1">
                      Learn More
                      <HiOutlineArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Project Management */}
            <Reveal variant="up" delay={950}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#042970] hover:shadow-md transition-all">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#042970]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-[#042970]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                      Project Management
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-2">
                      Efficient coordination and management of complex projects from conception to completion with proven methodologies.
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Project Planning</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Resource Management</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Timeline Coordination</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="text-[10px] sm:text-xs font-semibold text-[#042970] hover:text-[#F54927] inline-flex items-center gap-1">
                      Learn More
                      <HiOutlineArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* GIS Applications for Urban Planning */}
            <Reveal variant="up" delay={1000}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#F54927] hover:shadow-md transition-all">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F54927]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#F54927]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                      GIS Applications for Urban Planning
                            </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-2">
                      Advanced geographic information systems for data-driven urban development and spatial analysis.
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Spatial Analysis</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Data Mapping</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#F54927] flex-shrink-0" />
                        <span>Urban Analytics</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="text-[10px] sm:text-xs font-semibold text-[#F54927] hover:text-[#042970] inline-flex items-center gap-1">
                      Learn More
                      <HiOutlineArrowRight className="w-2.5 h-2.5" />
                    </Link>
                            </div>
                          </div>
                        </div>
            </Reveal>

            {/* Building Permit Support & Case Handling */}
            <Reveal variant="up" delay={1050}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-[#042970] hover:shadow-md transition-all">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#042970]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#042970]" />
                      </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                      Building Permit Support & Case Handling
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed mb-2">
                      Streamlined permit processes and regulatory compliance services to expedite your project approvals.
                    </p>
                    <ul className="space-y-1 mb-2">
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Permit Applications</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Regulatory Compliance</span>
                      </li>
                      <li className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700">
                        <HiOutlineCheckBadge className="w-2.5 h-2.5 text-[#042970] flex-shrink-0" />
                        <span>Documentation Support</span>
                      </li>
                    </ul>
                    <Link href="/contact" className="text-[10px] sm:text-xs font-semibold text-[#042970] hover:text-[#F54927] inline-flex items-center gap-1">
                      Learn More
                      <HiOutlineArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
                  </Reveal>
            </div>
          </section>

        {/* Why Choose Our Services */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <Reveal variant="up" delay={900}>
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
                Why Choose{' '}
                <span className="text-[#F54927] relative gradient-text inline-block">
                  Our Services
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
                Excellence built on expertise, innovation, and unwavering commitment to quality
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon
              return (
                <Reveal key={index} variant="up" delay={index * 100 + 1000}>
                  <div
                    onMouseEnter={() => setHoveredCard(`why-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`standard-card interactive-card-3d p-6 sm:p-8 text-center bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-transparent hover:border-[#F54927] transition-all duration-500 ${
                      hoveredCard === `why-${index}` ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'
                    }`}
                  >
                    <div
                      ref={(el) => { if (el) iconRefs.current[`why-${index}`] = el; }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-5 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float transition-all duration-500 ${
                        hoveredCard === `why-${index}` 
                          ? 'bg-gradient-to-br from-[#F54927] to-[#F54927]/80 scale-125 shadow-xl' 
                          : 'group-hover:from-[#F54927]/30 group-hover:to-[#F54927]/20'
                      }`}
                    >
                      <Icon className={`text-[#F54927] transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${
                        hoveredCard === `why-${index}` ? 'text-white scale-125' : ''
                      }`} style={{ width: '40px', height: '40px', fontWeight: 'bold' }} />
                    </div>
                    <h4 className={`font-extrabold mb-2 text-base sm:text-lg md:text-xl card-text-animate transition-all duration-300 ${
                      hoveredCard === `why-${index}` ? 'text-[#F54927] scale-105' : 'text-gray-900 group-hover:text-[#F54927]'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-sm sm:text-base leading-relaxed transition-all duration-300 ${
                      hoveredCard === `why-${index}` ? 'text-gray-800 font-medium' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Our Process */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <Reveal variant="up" delay={1100}>
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
                Our{' '}
                <span className="text-[#042970] relative gradient-text inline-block">
                  Process
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
                A structured approach ensuring quality delivery from concept to completion
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Reveal key={index} variant="up" delay={index * 100 + 1200}>
                  <div
                    onMouseEnter={() => setHoveredCard(`process-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`standard-card interactive-card-3d p-6 sm:p-8 relative bg-gradient-to-br from-[#042970]/10 via-white to-[#F54927]/10 border-2 border-transparent hover:border-[#042970] transition-all duration-500 ${
                      hoveredCard === `process-${index}` ? 'scale-105 shadow-2xl border-[#F54927]' : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="absolute top-4 right-4 text-6xl sm:text-7xl font-extrabold text-[#F54927]/10">
                      {step.step}
                    </div>
                    <div
                      ref={(el) => { if (el) iconRefs.current[`process-${index}`] = el; }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#042970]/20 to-[#042970]/10 rounded-xl flex items-center justify-center mb-4 sm:mb-5 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float transition-all duration-500 relative z-10 ${
                        hoveredCard === `process-${index}` 
                          ? 'bg-gradient-to-br from-[#042970] to-[#042970]/80 scale-125 shadow-xl' 
                          : 'group-hover:from-[#042970]/30 group-hover:to-[#042970]/20'
                      }`}
                    >
                      <Icon className={`text-[#042970] transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${
                        hoveredCard === `process-${index}` ? 'text-white scale-125' : ''
                      }`} style={{ width: '40px', height: '40px', fontWeight: 'bold' }} />
                    </div>
                    <h4 className={`font-extrabold mb-3 text-lg sm:text-xl md:text-2xl card-text-animate transition-all duration-300 relative z-10 ${
                      hoveredCard === `process-${index}` ? 'text-[#042970] scale-105' : 'text-gray-900 group-hover:text-[#042970]'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm sm:text-base leading-relaxed transition-all duration-300 relative z-10 ${
                      hoveredCard === `process-${index}` ? 'text-gray-800 font-medium' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <Reveal variant="up" delay={1300}>
          <section className="relative overflow-hidden rounded-xl sm:rounded-2xl standard-card p-0 group">
            <img 
              src="/images/getTouch.jpg" 
              alt="Get in touch" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/90 via-[#042970]/80 to-[#F54927]/90 group-hover:from-[#042970]/95 group-hover:via-[#042970]/85 group-hover:to-[#F54927]/95 transition-all duration-500"></div>
            
            <div className="relative z-10 px-6 sm:px-8 md:px-12 py-10 sm:py-12 md:py-16">
              <div className="max-w-3xl">
                <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">Ready to Start?</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-5 leading-tight">
                  Let's Build Something{' '}
                  <span className="text-[#F54927] relative inline-block">
                    Extraordinary Together
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-white animate-underline-expand"></span>
                  </span>
                </h3>
                <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8">
                  Tell us about your project and we'll respond with a clear plan, timeline, and budget options. 
                  Our team is ready to turn your vision into reality.
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
                  <Link 
                    href="/contact" 
                    className="standard-button bg-[#F54927] hover:bg-white hover:text-[#F54927] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-2 sm:gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#F54927]/50"
                  >
                    <HiOutlinePhone className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    Get a Quote
                    <HiOutlineArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                  <Link 
                    href="/projects" 
                    className="standard-button bg-white/10 hover:bg-white hover:text-[#042970] text-white border-2 border-white/30 hover:border-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-2 sm:gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
                  >
                    <HiOutlinePlayCircle className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    View Our Projects
                    <HiOutlineArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  )
}
