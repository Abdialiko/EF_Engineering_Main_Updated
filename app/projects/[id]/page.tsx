'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import PageHeader from '../../../components/PageHeader'
import Reveal from '../../../components/Reveal'
import Link from 'next/link'
import Image from 'next/image'
import { 
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUserGroup,
  HiOutlineCheckBadge,
  HiOutlineArrowRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineRocketLaunch
} from 'react-icons/hi2'
import { fetchApi, getImageUrl } from '../../../lib/api'

const getImage = (s: any) => {
  if (!s) return '/images/hero/home.jpg'
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
  if (s.image_url) {
    return s.image_url.startsWith('http') ? s.image_url : `https://api.efengineering-architect.com${s.image_url.startsWith('/') ? s.image_url : '/' + s.image_url}`
  }
  if (s.image) {
    return s.image.startsWith('http') ? s.image : `https://api.efengineering-architect.com${s.image.startsWith('/') ? s.image : '/' + s.image}`
  }
  return '/images/hero/home.jpg'
}

export default function ProjectDetail() {
  const params = useParams()
  const id = params?.id
  const [project, setProject] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [relatedProjects, setRelatedProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const relatedSliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectData, servicesData, projectsData] = await Promise.all([
          fetchApi(`projects/${id}`).catch(() => null),
          fetchApi('services').catch(() => []),
          fetchApi('projects').catch(() => []),
        ])

        const projectResult = Array.isArray(projectData) ? projectData[0] : (projectData?.data || projectData)
        const servicesArray = Array.isArray(servicesData) ? servicesData : (servicesData?.data || [])
        const projectsArray = Array.isArray(projectsData) ? projectsData : (projectsData?.data || [])
        
        setProject(projectResult)
        setServices(servicesArray)
        
        // Get related projects (same category, exclude current)
        const related = projectsArray
          .filter((p: any) => String(p.id) !== String(id))
          .slice(0, 6)
        setRelatedProjects(related)
      } catch (error) {
        console.error('Failed to load project:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadData()
  }, [id])

  const projectImages = project?.photos && Array.isArray(project.photos) && project.photos.length > 0
    ? project.photos.map((p: any) => typeof p === 'string' ? p : (p?.path || p?.url || p?.src))
    : project?.image_url || project?.image ? [getImage(project)] : ['/images/hero/home.jpg']

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedSliderRef.current) {
      const scrollAmount = 400
      relatedSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Loading..." />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Project Not Found" />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
          <Link href="/projects" className="mt-4 inline-block text-[#F54927] hover:underline">
            View All Projects
          </Link>
        </div>
      </div>
    )
  }

  const title = project?.title || project?.name || 'Project Details'
  const isCompleted = project?.is_completed == '1' || project?.is_completed === true || project?.progress == '100'
  const progress = project?.progress || (isCompleted ? 100 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <PageHeader title={title} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Image Section - No Border, Color Overlay */}
          <Reveal variant="up" delay={0}>
          <div className="relative h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden mb-8 md:mb-12 group">
            {projectImages.length > 0 && (
              <>
                <img 
                  src={projectImages[currentImageIndex]} 
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
                {/* Colorful Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/40 via-[#042970]/50 to-[#F54927]/30 group-hover:from-[#F54927]/50 group-hover:via-[#042970]/60 group-hover:to-[#F54927]/40 transition-all duration-500"></div>
                
                {/* Image Navigation if multiple images */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? projectImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-10"
                      aria-label="Previous image"
                    >
                      <HiOutlineChevronLeft className="w-6 h-6 text-[#042970]" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === projectImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-10"
                      aria-label="Next image"
                    >
                      <HiOutlineChevronRight className="w-6 h-6 text-[#042970]" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {projectImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            
            {/* Project Status Badge */}
            <div className="absolute top-6 right-6 z-10">
              <div className={`px-4 py-2 rounded-full shadow-xl backdrop-blur-sm ${
                isCompleted ? 'bg-[#10B981] text-white' : 'bg-[#042970] text-white'
              }`}>
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <HiOutlineCheckBadge className="w-5 h-5" />
                  ) : (
                    <HiOutlineClock className="w-5 h-5" />
                  )}
                  <span className="font-bold text-sm">
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Title and Meta */}
            <Reveal variant="up" delay={100}>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {title}
                </h1>
                
                {/* Project Meta Information */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-600">
                  {project?.category && (
                    <div className="flex items-center gap-2">
                      <HiOutlineBuildingOffice2 className="w-5 h-5 text-[#F54927]" />
                      <span className="font-semibold">{project.category}</span>
                    </div>
                  )}
                  {project?.location && (
                    <div className="flex items-center gap-2">
                      <HiOutlineMapPin className="w-5 h-5 text-[#042970]" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project?.start_date && (
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendar className="w-5 h-5 text-[#F54927]" />
                      <span>{new Date(project.start_date).getFullYear()}</span>
                    </div>
                  )}
                </div>
            </div>
          </Reveal>

            {/* Progress Bar */}
            {!isCompleted && (
              <Reveal variant="up" delay={150}>
                <div className="mb-8 p-6 bg-gradient-to-r from-[#042970]/10 to-[#F54927]/10 rounded-xl border-l-4 border-[#F54927]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">Project Progress</span>
                    <span className="font-extrabold text-[#F54927] text-lg">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F54927] to-[#042970] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
          </Reveal>
            )}

            {/* Description */}
            <Reveal variant="up" delay={200}>
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 mb-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-extrabold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#F54927] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-bold"
                  dangerouslySetInnerHTML={{ __html: project?.description || project?.details || '<p>Project details coming soon.</p>' }}
                />
              </div>
            </Reveal>

            {/* Additional Generated Content Sections */}
            <Reveal variant="up" delay={250}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Key Features */}
                <div className="bg-gradient-to-br from-[#F54927]/10 to-white rounded-xl p-6 border-l-4 border-[#F54927]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#F54927] rounded-lg flex items-center justify-center">
                      <HiOutlineLightBulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900">Key Features</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Innovative design solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Sustainable engineering practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Quality assurance and compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineCheckBadge className="w-5 h-5 text-[#F54927] flex-shrink-0 mt-0.5" />
                      <span>Expert project management</span>
                    </li>
                  </ul>
                </div>

                {/* Project Impact */}
                <div className="bg-gradient-to-br from-[#042970]/10 to-white rounded-xl p-6 border-l-4 border-[#042970]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#042970] rounded-lg flex items-center justify-center">
                      <HiOutlineChartBar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900">Project Impact</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Enhanced community infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Improved quality of life</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Economic development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiOutlineRocketLaunch className="w-5 h-5 text-[#042970] flex-shrink-0 mt-0.5" />
                      <span>Environmental sustainability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Call to Action */}
            <Reveal variant="up" delay={300}>
              <div className="bg-gradient-to-r from-[#042970] to-[#F54927] rounded-2xl p-8 md:p-10 text-white text-center">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Interested in Similar Projects?</h3>
                <p className="text-lg mb-6 text-white/90">Let's discuss how we can bring your vision to life.</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#042970] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  Get in Touch
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
              </div>
          </Reveal>
        </article>

          {/* Sidebar */}
        <aside className="lg:col-span-4">
            {/* Project Info Card */}
            <Reveal variant="left" delay={100}>
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 sticky top-6">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <HiOutlineBuildingOffice2 className="w-6 h-6 text-[#F54927]" />
                  Project Information
                </h3>
                <div className="space-y-4">
                  {project?.category && (
                    <div>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Category</span>
                      <p className="font-bold text-gray-900 mt-1">{project.category}</p>
                    </div>
                  )}
                  {project?.location && (
                    <div>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Location</span>
                      <p className="font-bold text-gray-900 mt-1">{project.location}</p>
                    </div>
                  )}
                  {project?.start_date && (
                    <div>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Start Date</span>
                      <p className="font-bold text-gray-900 mt-1">{new Date(project.start_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wide">Status</span>
                    <p className={`font-bold mt-1 ${isCompleted ? 'text-[#10B981]' : 'text-[#F54927]'}`}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                  {progress > 0 && (
                    <div>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">Progress</span>
                      <p className="font-bold text-gray-900 mt-1">{progress}%</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Services */}
            {services.length > 0 && (
              <Reveal variant="left" delay={200}>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <HiOutlineRocketLaunch className="w-6 h-6 text-[#042970]" />
                    Related Services
                  </h3>
              <ul className="space-y-3">
                    {services.slice(0, 5).map((svc: any) => (
                  <li key={String(svc.id)}>
                        <Link 
                          href={`/services/${svc.id}`}
                          className="flex items-center gap-3 group hover:bg-[#F54927]/5 p-2 rounded-lg transition-all duration-300"
                        >
                          <span className="inline-block w-2 h-2 rounded-full bg-[#F54927] group-hover:scale-150 transition-transform"></span>
                          <span className="font-semibold text-gray-700 group-hover:text-[#F54927] transition-colors">
                            {svc.title || svc.name}
                          </span>
                          <HiOutlineArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#F54927] group-hover:translate-x-1 transition-all ml-auto" />
                        </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
            )}
        </aside>
        </div>

        {/* Related Projects Slider */}
        {relatedProjects.length > 0 && (
          <section className="mt-16 md:mt-20">
          <Reveal variant="up" delay={0}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    Related{' '}
                    <span className="text-[#F54927]">Projects</span>
                  </h2>
                  <p className="text-gray-600">Explore more of our work</p>
                </div>
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => scrollRelated('left')}
                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#042970] hover:text-white transition-all duration-300 hover:scale-110"
                    aria-label="Scroll left"
                  >
                    <HiOutlineChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => scrollRelated('right')}
                    className="w-12 h-12 bg-[#F54927] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#042970] transition-all duration-300 hover:scale-110"
                    aria-label="Scroll right"
                  >
                    <HiOutlineChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
          </Reveal>

            <div className="relative">
              <div
                ref={relatedSliderRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                  {relatedProjects.map((rp: any, i: number) => {
                    const isCompleted = rp?.is_completed == '1' || rp?.is_completed === true || rp?.progress == '100'
                    return (
              <Reveal key={rp.id} variant="up" delay={i * 100}>
                        <Link
                          href={`/projects/${rp.id}`}
                          onMouseEnter={() => setHoveredCard(`related-${rp.id}`)}
                          onMouseLeave={() => setHoveredCard(null)}
                          className="block w-[320px] md:w-[380px] flex-shrink-0 group"
                          style={{ scrollSnapAlign: 'start' }}
                        >
                          <div className={`relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden transition-all duration-500 ${
                            hoveredCard === `related-${rp.id}` ? 'shadow-2xl scale-105' : 'shadow-lg hover:shadow-xl'
                          }`}>
                            <img 
                              src={getImage(rp)} 
                              alt={rp.title || rp.name} 
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                            {/* Colorful Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${
                              hoveredCard === `related-${rp.id}`
                                ? 'from-[#042970]/95 via-[#F54927]/80 to-[#042970]/40'
                                : 'from-[#042970]/90 via-[#F54927]/70 to-[#042970]/30 group-hover:from-[#042970]/92'
                            }`} />
                            
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-10">
                              <div className={`px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm ${
                                isCompleted ? 'bg-[#10B981]' : 'bg-[#042970]'
                              }`}>
                                {isCompleted ? (
                                  <HiOutlineCheckBadge className="w-4 h-4 text-white" />
                                ) : (
                                  <HiOutlineClock className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                              <div className="mb-2">
                                <span className="text-xs font-bold uppercase text-[#F54927] bg-white/20 px-2 py-1 rounded">
                                  {rp.category || 'Project'}
                                </span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-extrabold leading-tight mb-2 group-hover:text-[#F54927] transition-colors">
                                {rp.title || rp.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                                View Details
                                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                              </div>
                            </div>
                  </div>
                        </Link>
              </Reveal>
                    )
                  })}
                </div>
              </div>
          </div>
        </section>
      )}
      </main>
    </div>
  )
}
