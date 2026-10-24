'use client'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { fetchApi } from '../../lib/api'
import {
  HiOutlineBuildingOffice2,
  HiOutlineHomeModern,
  HiOutlineAcademicCap,
  HiOutlineTruck,
  HiOutlineMap,
  HiOutlineCube,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineRocketLaunch,
  HiOutlineArrowTrendingUp,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlinePlayCircle,
  HiOutlineLightBulb
} from 'react-icons/hi2'

const getImageUrl = (p: any) => {
  if (!p) return '/images/hero/home.jpg'
  
  // Handle photos array
  if (Array.isArray(p.photos) && p.photos.length) {
    const first = p.photos[0]
    if (typeof first === 'string') {
      return first.startsWith('http') ? first : `https://api.efengineering-architect.com${first.startsWith('/') ? first : '/' + first}`
    }
    const path = first?.path || first?.url || first?.src
    if (path) {
      return path.startsWith('http') ? path : `https://api.efengineering-architect.com${path.startsWith('/') ? path : '/' + path}`
    }
  }
  
  // Handle single image fields
  if (p.image_url) {
    return p.image_url.startsWith('http') ? p.image_url : `https://api.efengineering-architect.com${p.image_url.startsWith('/') ? p.image_url : '/' + p.image_url}`
  }
  if (p.image) {
    return p.image.startsWith('http') ? p.image : `https://api.efengineering-architect.com${p.image.startsWith('/') ? p.image : '/' + p.image}`
  }
  
  return '/images/hero/home.jpg'
}

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'on-progress'>('all')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [categoriesData, projectsData] = await Promise.all([
          fetchApi('categories').catch(() => []),
          fetchApi('projects').catch(() => []),
        ])
        
        // Handle different response structures
        const categoriesArray = Array.isArray(categoriesData) 
          ? categoriesData 
          : (categoriesData?.data || [])
        
        const projectsArray = Array.isArray(projectsData) 
          ? projectsData 
          : (projectsData?.data || [])
        
        console.log('Projects data received:', projectsData)
        console.log('Projects array:', projectsArray.length, 'items')
        console.log('Categories array:', categoriesArray.length, 'items')
        
        if (projectsArray.length === 0) {
          console.warn('No projects found. API response:', projectsData)
        }
        
        setCategories([{ id: 'all', name: 'All Projects' }, ...categoriesArray])
        setProjects(projectsArray)
      } catch (e) {
        console.error('Failed to load projects:', e)
        setCategories([{ id: 'all', name: 'All Projects' }])
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = projects.filter((p) => {
    const byCat = activeCategory === 'all' || String(p.category_id) === String(activeCategory)
    const byStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && (p.is_completed == '1' || p.is_completed === true || p.progress == '100')) ||
      (statusFilter === 'on-progress' && (p.is_completed == '0' || p.is_completed === false) && p.progress != '100')
    return byCat && byStatus
  })

  const completedProjects = projects.filter(p => p.is_completed == '1' || p.is_completed === true || p.progress == '100')
  const inProgressProjects = projects.filter(p => (p.is_completed == '0' || p.is_completed === false) && p.progress != '100')

  // Project statistics
  const projectStats = [
    { label: 'Total Projects', value: projects.length, icon: HiOutlineBuildingOffice2, color: '#F54927' },
    { label: 'Completed', value: completedProjects.length, icon: HiOutlineCheckBadge, color: '#10B981' },
    { label: 'In Progress', value: inProgressProjects.length, icon: HiOutlineClock, color: '#042970' },
    { label: 'Success Rate', value: projects.length > 0 ? Math.round((completedProjects.length / projects.length) * 100) : 0, suffix: '%', icon: HiOutlineStar, color: '#F54927' }
  ]

  // Project types with icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || ''
    if (name.includes('residential') || name.includes('housing')) return HiOutlineHomeModern
    if (name.includes('university') || name.includes('education') || name.includes('school')) return HiOutlineAcademicCap
    if (name.includes('industrial') || name.includes('warehouse')) return HiOutlineTruck
    if (name.includes('urban') || name.includes('planning')) return HiOutlineMap
    if (name.includes('commercial') || name.includes('office')) return HiOutlineBuildingOffice2
    return HiOutlineCube
  }

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-[#F54927]/5 rounded-full continuous-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
      </div>

      <PageHeader title="Our Projects" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section */}
        <Reveal variant="up" delay={0}>
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">Our Portfolio</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Showcasing{' '}
              <span className="text-[#042970] relative gradient-text inline-block">
                Excellence in Engineering
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h1>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 px-4">
              Discover our completed and in-progress projects across diverse sectors. 
              Each project represents our commitment to quality, innovation, and client satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <Link href="/contact" className="standard-button bg-[#F54927] hover:bg-[#042970] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50">
                Start Your Project
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-white" />
              </Link>
              <Link href="#projects" className="standard-button border-2 border-[#042970] hover:bg-[#042970] hover:text-white text-[#042970] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl">
                View Projects
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Project Statistics */}
        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            {projectStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`standard-card interactive-card-3d p-3 sm:p-4 text-center bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-transparent hover:border-[#F54927] transition-all duration-500 ${
                    hoveredCard === `stat-${index}` ? 'scale-105 shadow-xl' : 'hover:shadow-lg'
                  }`}
                >
                  <div
                    ref={(el) => { if (el) iconRefs.current[`stat-${index}`] = el; }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-lg flex items-center justify-center mx-auto mb-2 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float transition-all duration-500 ${
                        hoveredCard === `stat-${index}` 
                          ? 'bg-gradient-to-br from-[#F54927] to-[#F54927]/80 scale-110 shadow-lg' 
                          : 'group-hover:from-[#F54927]/30 group-hover:to-[#F54927]/20'
                      }`}
                    style={{ backgroundColor: hoveredCard === `stat-${index}` ? stat.color : undefined }}
                  >
                    <Icon className={`transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${
                      hoveredCard === `stat-${index}` ? 'text-white scale-110' : ''
                    }`} style={{ width: '20px', height: '20px', fontWeight: 'bold', color: hoveredCard === `stat-${index}` ? 'white' : stat.color }} />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-extrabold mb-1 transition-all duration-300 ${
                    hoveredCard === `stat-${index}` ? 'text-[#F54927] scale-105' : 'text-gray-900'
                  }`} style={{ color: hoveredCard === `stat-${index}` ? stat.color : undefined }}>
                    {stat.value}{stat.suffix || ''}
                  </div>
                  <p className={`text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                    hoveredCard === `stat-${index}` ? 'text-gray-800' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </Reveal>

        {/* Status Filter - Top Bar */}
        <Reveal variant="up" delay={200}>
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  Browse{' '}
                  <span className="text-[#F54927]">
                    Projects
                  </span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {filtered.length} {filtered.length === 1 ? 'project' : 'projects'} found
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-full border-2 border-gray-200 shadow-sm w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none ${
                    statusFilter === 'all'
                      ? 'bg-[#F54927] text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:text-[#F54927]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none ${
                    statusFilter === 'completed'
                      ? 'bg-[#10B981] text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:text-[#10B981]'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setStatusFilter('on-progress')}
                  className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none ${
                    statusFilter === 'on-progress'
                      ? 'bg-[#042970] text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:text-[#042970]'
                  }`}
                >
                  In Progress
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Projects Grid with Sidebar */}
        <section id="projects" className="mb-12 sm:mb-16 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Category Sidebar */}
            <aside className="lg:col-span-1">
              <Reveal variant="left" delay={250}>
                <div className="standard-card interactive-card-3d p-5 sm:p-6 bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-gray-200 hover:border-[#F54927] sticky top-6 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-lg flex items-center justify-center icon-container icon-micro-move">
                      <HiOutlineCube className="text-[#F54927] w-5 h-5" style={{ fontWeight: 'bold' }} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                      Categories
                    </h3>
                  </div>
                  <div className="space-y-2 sm:space-y-2.5">
                    {categories.map((c: any, i: number) => {
                      const Icon = getCategoryIcon(c.name)
                      const isActive = String(c.id) === String(activeCategory)
                      return (
                        <button
                          key={String(c.id)}
                          onClick={() => setActiveCategory(String(c.id))}
                          onMouseEnter={() => setHoveredCard(`cat-${c.id}`)}
                          onMouseLeave={() => setHoveredCard(null)}
                          className={`w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-left transition-all duration-300 group ${
                            isActive
                              ? 'bg-[#F54927] text-white shadow-lg shadow-[#F54927]/50 scale-105'
                              : hoveredCard === `cat-${c.id}`
                              ? 'bg-[#F54927]/10 text-[#F54927] scale-105 border-2 border-[#F54927]/30'
                              : 'bg-white text-gray-700 hover:bg-[#F54927]/5 hover:text-[#F54927] border-2 border-transparent hover:border-[#F54927]/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-[#F54927]/10 group-hover:bg-[#F54927]/20'
                          }`}>
                            <Icon className={`w-5 h-5 transition-all duration-300 ${
                              isActive ? 'text-white' : 'text-[#F54927]'
                            }`} style={{ fontWeight: 'bold' }} />
                          </div>
                          <span className={`font-bold text-sm sm:text-base flex-1 transition-all duration-300 ${
                            isActive ? 'text-white' : 'text-gray-700 group-hover:text-[#F54927]'
                          }`}>
                      {c.name}
                          </span>
                          {isActive && (
                            <HiOutlineCheckBadge className="w-5 h-5 text-white flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Reset Filter Button */}
                  {activeCategory !== 'all' && (
                    <button
                      onClick={() => setActiveCategory('all')}
                      className="w-full mt-4 sm:mt-5 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-[#F54927] hover:text-white text-gray-700 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Reset Filter
                    </button>
                  )}
              </div>
            </Reveal>
          </aside>

            {/* Projects Grid */}
            <div className="lg:col-span-3">
            {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {new Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl" />
              ))}
              </div>
            ) : filtered.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filtered.map((p: any, i: number) => {
                const CategoryIcon = getCategoryIcon(p.category)
                return (
                  <Reveal key={p.id} variant="up" delay={i * 80 + 300}>
                    <Link
                      href={`/projects/${p.id}`}
                      onMouseEnter={() => setHoveredCard(`project-${p.id}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="block group focus:outline-none"
                    >
                      <div className={`standard-card interactive-card-3d p-0 overflow-hidden aspect-square border-2 border-transparent transition-all duration-500 ${
                        hoveredCard === `project-${p.id}` 
                          ? 'border-[#F54927] shadow-2xl scale-105' 
                          : 'hover:border-[#042970]/20 hover:shadow-xl hover:scale-105'
                      }`}>
                        <div className="relative w-full h-full bg-gray-200 overflow-hidden">
                          <img
                            src={getImageUrl(p)}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            loading={i < 6 ? "eager" : "lazy"}
                          />
                          
                          {/* Category Badge */}
                          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-10">
                            <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#F54927] rounded-lg transition-all duration-300 shadow-lg ${
                              hoveredCard === `project-${p.id}` ? 'scale-110 shadow-xl' : ''
                            }`}>
                              <CategoryIcon className="text-white w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" style={{ fontWeight: 'bold' }} />
                              <span className="text-white text-[10px] sm:text-xs font-bold uppercase leading-tight">
                                {p.category || 'Project'}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10">
                            {p.progress !== undefined && p.progress < 100 ? (
                              <div className={`bg-[#042970] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-300 shadow-lg ${
                                hoveredCard === `project-${p.id}` ? 'scale-110 shadow-xl' : ''
                              }`}>
                                <span className="text-[10px] sm:text-xs font-bold">{p.progress}%</span>
                              </div>
                            ) : (p.is_completed == '1' || p.is_completed === true || p.progress == '100') ? (
                              <div className={`bg-[#10B981] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-300 shadow-lg ${
                                hoveredCard === `project-${p.id}` ? 'scale-110 shadow-xl' : ''
                              }`}>
                                <HiOutlineCheckBadge className="w-3 h-3 sm:w-4 sm:h-4" />
                              </div>
                            ) : null}
                          </div>

                          {/* Content Overlay - Subtle dark gradient for text readability */}
                          <div className="absolute inset-0 p-3 sm:p-4 md:p-5 text-white z-10 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                            {/* Title */}
                            <h3 className={`text-sm sm:text-base md:text-lg font-extrabold leading-tight mb-2 sm:mb-2.5 transition-all duration-300 line-clamp-2 ${
                              hoveredCard === `project-${p.id}` ? 'scale-105' : ''
                            }`}>
                              {p.title}
                            </h3>
                            
                            {/* Progress Bar with Number - Always Visible */}
                            <div className="mb-2 sm:mb-2.5">
                              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                                <span className="text-[10px] sm:text-xs font-semibold text-white/95">
                                  {p.progress == '100' || p.is_completed == '1' || p.is_completed === true ? 'Completed' : 'In Progress'}
                                </span>
                                <span className="text-[10px] sm:text-xs font-bold text-white bg-black/40 px-1.5 sm:px-2 py-0.5 rounded">
                                  {p.progress !== undefined ? `${p.progress}%` : (p.is_completed == '1' || p.is_completed === true ? '100%' : '0%')}
                                </span>
                              </div>
                              <div className="w-full h-2 sm:h-2.5 bg-white/30 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    p.progress == '100' || p.is_completed == '1' || p.is_completed === true
                                      ? 'bg-[#10B981]' 
                                      : p.progress !== undefined
                                      ? 'bg-[#F54927]'
                                      : 'bg-[#042970]'
                                  }`}
                                  style={{ width: `${p.progress !== undefined ? p.progress : (p.is_completed == '1' || p.is_completed === true ? 100 : 0)}%` }}
                                />
                              </div>
                            </div>

                            {/* View Details Link */}
                            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold uppercase group-hover:gap-1.5 sm:group-hover:gap-2 transition-all">
                              View Details
                              <HiOutlineArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform text-white flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
              </div>
            ) : (
              <Reveal variant="up">
                <div className="text-center py-12 sm:py-16 md:py-20">
                  <HiOutlineBuildingOffice2 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3">No Projects Found</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">Try adjusting your filters to see more projects.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('all')
                      setStatusFilter('all')
                    }}
                    className="standard-button bg-[#F54927] hover:bg-[#042970] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              </Reveal>
            )}
            </div>
          </div>
        </section>

        {/* Project Highlights Section */}
        {completedProjects.length > 0 && (
          <section className="mb-12 sm:mb-16 md:mb-20">
            <Reveal variant="up" delay={400}>
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
                  Featured{' '}
                  <span className="text-[#F54927] relative gradient-text inline-block">
                    Completed Projects
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                  </span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
                  Showcasing our successful project deliveries across various sectors
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {completedProjects.slice(0, 3).map((p: any, i: number) => {
                const CategoryIcon = getCategoryIcon(p.category)
                return (
                  <Reveal key={p.id} variant="up" delay={i * 100 + 500}>
                    <Link
                      href={`/projects/${p.id}`}
                      onMouseEnter={() => setHoveredCard(`featured-${p.id}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="block group focus:outline-none"
                    >
                      <div className={`standard-card interactive-card-3d p-0 overflow-hidden h-full border-2 border-[#10B981]/30 transition-all duration-500 ${
                        hoveredCard === `featured-${p.id}` 
                          ? 'border-[#10B981] shadow-2xl scale-105' 
                          : 'hover:border-[#10B981]/50 hover:shadow-xl hover:scale-105'
                      }`}>
                        <div className="relative h-[300px] sm:h-[340px] md:h-[380px] bg-gray-200 overflow-hidden">
                          <img
                            src={getImageUrl(p)}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading={i < 3 ? "eager" : "lazy"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/75 transition-all duration-500" />
                          
                          <div className="absolute top-4 left-4 z-10">
                            <div className="bg-[#10B981] text-white px-4 py-2 rounded-xl flex items-center gap-2">
                              <HiOutlineCheckBadge className="w-5 h-5" />
                              <span className="text-sm font-bold">Completed</span>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon className="w-5 h-5" />
                              <span className="text-xs sm:text-sm font-semibold uppercase">{p.category || 'Project'}</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight mb-3">
                              {p.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm sm:text-base font-bold uppercase group-hover:gap-3 transition-all">
                              View Project
                              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-white" />
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
        )}

        {/* Enhanced CTA Section */}
        <Reveal variant="up" delay={600}>
          <section className="relative overflow-hidden rounded-xl sm:rounded-2xl standard-card p-0 group">
            <img 
              src="/images/hero/home.jpg" 
              alt="Start your project" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/90 via-[#042970]/80 to-[#F54927]/90 group-hover:from-[#042970]/95 group-hover:via-[#042970]/85 group-hover:to-[#F54927]/95 transition-all duration-500"></div>
            
            <div className="relative z-10 px-6 sm:px-8 md:px-12 py-10 sm:py-12 md:py-16">
              <div className="max-w-3xl">
                <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">Ready to Start?</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-5 leading-tight">
                  Let's Bring Your{' '}
                  <span className="text-[#F54927] relative inline-block">
                    Vision to Life
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-white animate-underline-expand"></span>
                  </span>
                </h3>
                <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8">
                  Partner with us to create exceptional engineering solutions. Our team is ready to discuss your project 
                  and provide expert guidance from concept to completion.
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
                  <Link 
                    href="/contact" 
                    className="standard-button bg-[#F54927] hover:bg-white hover:text-[#F54927] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-2 sm:gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#F54927]/50"
                  >
                    <HiOutlinePhone className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    Start Your Project
                    <HiOutlineArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                  <Link 
                    href="/services" 
                    className="standard-button bg-white/10 hover:bg-white hover:text-[#042970] text-white border-2 border-white/30 hover:border-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-2 sm:gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
                  >
                    <HiOutlineLightBulb className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    Our Services
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
