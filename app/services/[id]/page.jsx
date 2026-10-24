'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageHeader from '../../../components/PageHeader'
import Reveal from '../../../components/Reveal'
import Link from 'next/link'
import Image from 'next/image'
import { 
  HiOutlineRocketLaunch,
  HiOutlineCheckBadge,
  HiOutlineLightBulb,
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2'
import { fetchApi, getImageUrl } from '../../../lib/api'

const getImage = (s) => {
  if (!s) return '/images/hero/home.jpg'
  if (s.image_url) {
    return s.image_url.startsWith('http') ? s.image_url : `https://api.efengineering-architect.com${s.image_url.startsWith('/') ? s.image_url : '/' + s.image_url}`
  }
  if (s.image) {
    return s.image.startsWith('http') ? s.image : `https://api.efengineering-architect.com${s.image.startsWith('/') ? s.image : '/' + s.image}`
  }
  if (s.photo) {
    return s.photo.startsWith('http') ? s.photo : `https://api.efengineering-architect.com${s.photo.startsWith('/') ? s.photo : '/' + s.photo}`
  }
  if (Array.isArray(s.photos) && s.photos.length) {
    const first = s.photos[0]
    if (typeof first === 'string') {
      return first.startsWith('http') ? first : `https://api.efengineering-architect.com${first.startsWith('/') ? first : '/' + first}`
    }
    const path = first?.path || first?.url || first?.src
    if (path) {
      return path.startsWith('http') ? path : `https://api.efengineering-architect.com${path.startsWith('/') ? path : '/' + path}`
    }
  }
  if (Array.isArray(s.image_urls) && s.image_urls.length) {
    const first = s.image_urls[0]
    return first.startsWith('http') ? first : `https://api.efengineering-architect.com${first.startsWith('/') ? first : '/' + first}`
  }
  return '/images/hero/home.jpg'
}

export default function ServiceDetail() {
  const params = useParams()
  const id = params?.id
  const [service, setService] = useState(null)
  const [otherServices, setOtherServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [serviceData, servicesData] = await Promise.all([
          fetchApi(`services/${id}`).catch(() => null),
          fetchApi('services').catch(() => []),
        ])

        const serviceResult = Array.isArray(serviceData) ? serviceData[0] : (serviceData?.data || serviceData)
        const servicesArray = Array.isArray(servicesData) ? servicesData : (servicesData?.data || [])
        
        setService(serviceResult)
        
        // Get other services (exclude current)
        const others = servicesArray
          .filter((s) => String(s.id) !== String(id))
          .slice(0, 6)
        setOtherServices(others)
      } catch (error) {
        console.error('Failed to load service:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <PageHeader title="Loading..." />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <PageHeader title="Service Not Found" />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
          <Link href="/services" className="mt-4 inline-block text-[#F54927] hover:underline">
            View All Services
          </Link>
        </div>
      </div>
    )
  }

  const title = service?.title || service?.name || 'Service'
  const imageUrl = getImage(service)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PageHeader title={title} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
        <article className="lg:col-span-8">
            {/* Compact Image - Not Big */}
          <Reveal variant="up" delay={0}>
              <div className="relative h-[200px] md:h-[250px] rounded-xl overflow-hidden mb-6 group">
                <img 
                  src={imageUrl} 
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/20 via-[#042970]/20 to-transparent group-hover:from-[#F54927]/30 group-hover:via-[#042970]/30 transition-all duration-500"></div>
              </div>
            </Reveal>

            {/* Title and Meta */}
            <Reveal variant="up" delay={100}>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {title}
                </h1>
                
                {/* Service Meta Information */}
                {service?.category && (
                  <div className="flex items-center gap-2 mb-4">
                    <HiOutlineBuildingOffice2 className="w-5 h-5 text-[#F54927]" />
                    <span className="text-sm md:text-base font-semibold text-gray-600">{service.category}</span>
                  </div>
                )}
            </div>
          </Reveal>

            {/* Description */}
            <Reveal variant="up" delay={200}>
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-10 mb-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-extrabold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#F54927] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-bold"
                  dangerouslySetInnerHTML={{ __html: service?.description || '<p>Service details coming soon.</p>' }}
              />
            </div>
          </Reveal>

            {/* Interactive Features Sections */}
            <Reveal variant="up" delay={250}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Key Benefits */}
                <div className="bg-gradient-to-br from-[#F54927]/10 to-white rounded-xl p-6 border-l-4 border-[#F54927] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#F54927] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HiOutlineCheckBadge className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900">Key Benefits</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Expert consultation and guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Proven track record of success</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Comprehensive project management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Quality assurance and compliance</span>
                    </li>
                  </ul>
                </div>

                {/* Why Choose This Service */}
                <div className="bg-gradient-to-br from-[#042970]/10 to-white rounded-xl p-6 border-l-4 border-[#042970] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#042970] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HiOutlineLightBulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900">Why Choose Us</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Innovative solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Experienced professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Timely project delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Cost-effective solutions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Service Highlights */}
            <Reveal variant="up" delay={300}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <HiOutlineShieldCheck className="w-8 h-8 text-[#F54927] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-semibold text-gray-600">Quality Assured</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <HiOutlineClock className="w-8 h-8 text-[#042970] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-semibold text-gray-600">On-Time Delivery</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <HiOutlineUserGroup className="w-8 h-8 text-[#F54927] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-semibold text-gray-600">Expert Team</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <HiOutlineChartBar className="w-8 h-8 text-[#042970] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-semibold text-gray-600">Proven Results</p>
                </div>
              </div>
            </Reveal>

            {/* Call to Action */}
            <Reveal variant="up" delay={350}>
              <div className="bg-gradient-to-r from-[#042970] to-[#F54927] rounded-xl p-8 md:p-10 text-white text-center">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Ready to Get Started?</h3>
                <p className="text-lg mb-6 text-white/90">Let's discuss how we can help you achieve your goals.</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#042970] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  Contact Us
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
            </div>
          </Reveal>
        </article>

          {/* Sidebar */}
        <aside className="lg:col-span-4">
            {/* Service Info Card */}
            <Reveal variant="left" delay={100}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-6">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <HiOutlineRocketLaunch className="w-6 h-6 text-[#F54927]" />
                  Service Information
                </h3>
                <div className="space-y-4">
                  {service?.category && (
                    <div>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Category</span>
                      <p className="font-bold text-gray-900 mt-1">{service.category}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wide">Service Type</span>
                    <p className="font-bold text-gray-900 mt-1">Professional Consultation</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Other Services */}
            {otherServices.length > 0 && (
              <Reveal variant="left" delay={200}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <HiOutlineBuildingOffice2 className="w-6 h-6 text-[#042970]" />
                    Other Services
                  </h3>
              <ul className="space-y-3">
                    {otherServices.map((s) => (
                  <li key={String(s.id)}>
                        <Link 
                          href={`/services/${s.id}`}
                          className="flex items-center gap-3 group hover:bg-[#F54927]/5 p-2 rounded-lg transition-all duration-300"
                          onMouseEnter={() => setHoveredCard(`service-${s.id}`)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full transition-all duration-300 ${
                            hoveredCard === `service-${s.id}` ? 'bg-[#F54927] scale-150' : 'bg-[#F54927]'
                          }`}></span>
                          <span className={`font-semibold text-gray-700 flex-1 transition-colors ${
                            hoveredCard === `service-${s.id}` ? 'text-[#F54927]' : ''
                          }`}>
                            {s.title || s.name}
                          </span>
                          <HiOutlineArrowRight className={`w-4 h-4 text-gray-400 transition-all ${
                            hoveredCard === `service-${s.id}` ? 'text-[#F54927] translate-x-1' : ''
                          }`} />
                        </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
            )}
        </aside>
        </div>
      </main>
    </div>
  )
}
