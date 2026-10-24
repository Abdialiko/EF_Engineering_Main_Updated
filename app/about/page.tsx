'use client'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  HiOutlineBuildingOffice2,
  HiOutlineCube,
  HiOutlineMap,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
  HiOutlineMapPin,
  HiOutlineDocumentCheck,
  HiOutlineStar,
  HiOutlineRocketLaunch,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineAcademicCap,
  HiOutlineHomeModern,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlineComputerDesktop,
  HiOutlineTrophy,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlinePlayCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlineBookOpen
} from 'react-icons/hi2'

const counters = [
  { label: 'Years of Experience', value: 10 },
  { label: 'Specialists', value: 39 },
  { label: 'Successful Projects', value: 27 },
  { label: 'Completed Tasks', value: 210 },
]

export default function About() {
  const [nums, setNums] = useState<number[]>(counters.map(() => 0))
  const [started, setStarted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [team, setTeam] = useState<any[]>([])
  const [teamLoading, setTeamLoading] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isPaused, setIsPaused] = useState(false)
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const teamScrollRef = useRef<HTMLDivElement>(null)
  const autoScrollId = useRef<number | null>(null)

  useEffect(() => {
    const el = document.getElementById('about-stats')
    if (!el) return
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          setStarted(true)
          const duration = 1500
          const steps = 60
          const tick = duration / steps
          counters.forEach((c, i) => {
            let cur = 0
            const inc = c.value / steps
            const t = setInterval(() => {
              cur += inc
              setNums((prev) => {
                const next = [...prev]
                next[i] = Math.min(Math.round(cur), c.value)
                return next
              })
              if (cur >= c.value) clearInterval(t)
            }, tick)
          })
        }
      })
    }, { threshold: 0.25 })
    ob.observe(el)
    return () => ob.disconnect()
  }, [started])

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setTeamLoading(true)
        const res = await fetch('https://api.efengineering-architect.com/api/teams', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load team')
        const data = await res.json()
        setTeam(Array.isArray(data) ? data : data?.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setTeamLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const startAutoScroll = () => {
    if (autoScrollId.current !== null) {
      cancelAnimationFrame(autoScrollId.current)
    }
    if (team.length === 0 || isPaused || teamLoading) return
    
    const scrollContainer = teamScrollRef.current
    if (!scrollContainer) {
      setTimeout(startAutoScroll, 100)
      return
    }
    
    const scrollSpeed = 1.3 // pixels per frame
    let lastTime = performance.now()
    let scrollPosition = scrollContainer.scrollLeft

    const animate = (currentTime: number) => {
      if (!scrollContainer || team.length === 0 || isPaused || teamLoading) {
        if (autoScrollId.current !== null) {
          cancelAnimationFrame(autoScrollId.current)
          autoScrollId.current = null
        }
        return
      }
      
      const elapsed = currentTime - lastTime
      lastTime = currentTime
      
      const frameTime = Math.min(elapsed, 16.67) // Cap at 60fps
      const scrollAmount = scrollSpeed * (frameTime / 16.67)
      scrollPosition += scrollAmount
      
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      // Infinite scroll logic - seamless loop
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
    if (team.length > 0 && !teamLoading) {
      startAutoScroll()
    }
    return () => {
      stopAutoScroll()
    }
  }, [team.length, teamLoading])

  // Pause on hover
  useEffect(() => {
    const container = teamScrollRef.current
    if (!container) return

    const handleMouseEnter = () => setIsPaused(true)
    const handleMouseLeave = () => setIsPaused(false)

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!isPaused && team.length > 0 && !teamLoading) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
  }, [isPaused])


  const services = [
    { title: 'Architectural & Engineering Design', icon: HiOutlineCube, description: 'Professional design services for buildings and structures', image: '/images/hero/home.jpg' },
    { title: 'Urban Planning & Neighborhood Design', icon: HiOutlineMap, description: 'Comprehensive urban planning and neighborhood development solutions', image: '/images/hero/bonga.jpg' },
    { title: 'Construction Management & Supervision', icon: HiOutlineWrenchScrewdriver, description: 'Expert oversight and management of construction projects', image: '/images/hero/3d4.jpg' },
    { title: 'Project Management', icon: HiOutlineChartBar, description: 'Efficient coordination and management of complex projects', image: '/images/hero/house.jpg' },
    { title: 'GIS Applications for Urban Planning', icon: HiOutlineMapPin, description: 'Advanced geographic information systems for urban development', image: '/images/hero/mettu.jpg' },
    { title: 'Building Permit Support & Case Handling', icon: HiOutlineDocumentCheck, description: 'Streamlined permit processes and regulatory compliance', image: '/images/hero/industrialpark.jpg' },
  ]

  const projectTypes = [
    'Rural Transformation Centers',
    'Warehouses & Industrial Facilities',
    'University Campus Projects',
    'Addis Ababa Housing Developments',
    'Mixed-Use & Commercial Buildings'
  ]

  const keyStrengths = [
    { title: 'Skilled multidisciplinary teams', description: 'Expert professionals working together seamlessly', icon: HiOutlineUserGroup },
    { title: 'Clear client communication', description: 'Transparent and effective project updates', icon: HiOutlineChatBubbleLeftRight },
    { title: 'Strong project leadership', description: 'Experienced management ensuring success', icon: HiOutlineTrophy },
    { title: 'Continuous training and development', description: 'Staying ahead with latest industry practices', icon: HiOutlineAcademicCap },
    { title: 'Use of modern engineering software and tools', description: 'Cutting-edge technology for superior results', icon: HiOutlineComputerDesktop },
  ]

  // Merged projects with categories
  const allProjects = [
    // Universities & Education
    { name: 'Mettu University', description: 'Design, review, supervision, and contract administration of multiple buildings, including the Main Campus Referral Hospital and SB+G+2 Health Center Building at Mattu Campus.', icon: HiOutlineAcademicCap, image: '/images/hero/mettu.jpg', category: 'Universities & Education' },
    { name: 'Bonga University', description: 'Design, supervision, and contract administration of multiple buildings, including G+4 Food Laboratory, Dining Hall, and Kitchen.', icon: HiOutlineAcademicCap, image: '/images/hero/bonga.jpg', category: 'Universities & Education' },
    { name: 'Kotebe University of Education', description: 'Design of B+G+9 Faculty of Social Sciences, B+G+9 College of Education Complex, B+G+5 One-Stop Student Service Complex, G+2 Student Dining, Kitchen, and Clinic, including laboratory facilities and soil investigation.', icon: HiOutlineAcademicCap, image: '/images/hero/mettu.jpg', category: 'Universities & Education' },
    { name: 'Borena University', description: 'Supervision and contract administration of multiple buildings, including G+4 dormitories, seminar hall, food laboratory, classrooms, decentralized administration building, and department head building.', icon: HiOutlineAcademicCap, image: '/images/hero/mettu.jpg', category: 'Universities & Education' },
    { name: 'Ministry of Education', description: 'Design review, supervision, and contract administration of building renovation, fence work, main gate, and water drilling projects.', icon: HiOutlineBuildingOffice2, image: '/images/hero/bonga.jpg', category: 'Universities & Education' },
    
    // Medical & Healthcare
    { name: 'Yekatit 12 Medical College', description: 'Soil investigation, design, construction supervision, and contract administration for B+SB+G+9 Office Building and G+2 Cafeteria Building.', icon: HiOutlineBuildingOffice2, image: '/images/hero/home.jpg', category: 'Medical & Healthcare' },
    { name: 'AACRA Clinic', description: 'Consultancy services for design review and contract supervision of clinic, store, and machinery garage.', icon: HiOutlineBuildingOffice2, image: '/images/hero/bonga.jpg', category: 'Medical & Healthcare' },
    { name: 'Ministry of Health', description: 'Complete design, quality control, supervision, and contract administration including VIP clinic renovation and landscaping at Grand Palace Arat Killo.', icon: HiOutlineBuildingOffice2, image: '/images/hero/3d4.jpg', category: 'Medical & Healthcare' },
    
    // Industrial & Warehouses
    { name: 'Oromia Industrial Parks Development Corporation', description: 'Design, supervision, and contract administration of Five RTC Construction Works (Olanchiti, Bale Robe, Dodola, Iteya, Meki).', icon: HiOutlineTruck, image: '/images/hero/industrialpark.jpg', category: 'Industrial & Warehouses' },
    { name: 'Ethiopian Commodity Exchange (ECX)', description: 'Design, supervision, and contract administration of multiple warehouses: Gonder, Kombolcha, Humera, Bule Hora, and Mettu.', icon: HiOutlineTruck, image: '/images/hero/industrialpark.jpg', category: 'Industrial & Warehouses' },
    
    // Housing & Residential
    { name: 'Addis Ababa Housing', description: 'Consultancy services for four 3B+G+21 buildings, including soil investigation, foundation adaptation, full engineering design, tender preparation, cost estimation, and construction supervision.', icon: HiOutlineHomeModern, image: '/images/hero/house.jpg', category: 'Housing & Residential' },
    
    // Government & Public Institutions
    { name: 'FDRE Custom Commission', description: 'Supervision of Moyale, Yabello, and Midregenet checking points.', icon: HiOutlineBuildingOffice2, image: '/images/hero/3d4.jpg', category: 'Government & Public Institutions' },
    
    // Agricultural & Commercial
    { name: 'Ethiopian Agricultural Business Corporation', description: 'Design review, supervision, and contract administration for renovation and refurbishment of existing buildings, new two-floor blocks, and landscape works.', icon: HiOutlineBuildingOffice2, image: '/images/hero/home.jpg', category: 'Agricultural & Commercial' },
  ]

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))]

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-[#F54927]/5 rounded-full continuous-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 border-2 border-[#042970]/5 rounded-full animate-rotate-slow hidden lg:block" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F54927]/20 to-transparent motion-line hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#042970]/20 to-transparent motion-line hidden lg:block" style={{ animationDelay: '1s' }}></div>
      </div>

      <PageHeader title="About Us" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section with Image */}
        <Reveal variant="up" delay={0}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-10 sm:mb-12 md:mb-16">
            {/* Left Side - Single Image with Animated Card */}
            <div className="order-2 lg:order-1 relative group">
              <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
                {/* Main Image */}
                <img
                  src="/images/about/3d4.webp"
                  alt="EF Architects & Engineers"
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-105 interactive-card-3d image-hover-effect"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/10 to-[#042970]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="order-1 lg:order-2">
              <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 sm:mb-3">About Us</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                About{' '}
                <span className="text-[#042970] relative gradient-text">
                  EF Architects & Engineers
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h1>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                EF Architects & Engineers Consulting Plc. is a Category I consulting firm established in 2015 GC by Engineer Endale Abdissa. 
                With extensive experience in the architecture and engineering sector, the company delivers professional architectural, 
                engineering, and construction management services across Ethiopia and internationally.
              </p>
              
              {/* Head Office Card */}
              <div className="standard-card interactive-card-3d p-4 sm:p-5 mb-6 bg-gradient-to-r from-[#F54927]/5 to-[#042970]/5 border-l-4 border-[#F54927] hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F54927]/10 rounded-full flex items-center justify-center flex-shrink-0 icon-container icon-micro-move icon-float">
                    <HiOutlineMapPin className="text-[#F54927] text-xl sm:text-2xl icon-hover icon-glow icon-bounce" style={{ fontWeight: 'bold' }} />
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg">
                      Head Office: Yeka Sub-City, Wereda 09, Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/contact" className="standard-button bg-[#F54927] hover:bg-[#042970] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2 sm:gap-3 group">
                  <HiOutlinePhone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Us
                  <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform icon-full-color" />
                </Link>
                <Link href="/projects" className="standard-button border-2 border-[#042970] hover:bg-[#042970] hover:text-white text-[#042970] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base inline-flex items-center justify-center gap-2 sm:gap-3 group">
                  <HiOutlinePlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  View Projects
                  <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform icon-full-color" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Multidisciplinary Team Section */}
        <Reveal variant="up" delay={100}>
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
              {/* Left Side - Content (No Card) */}
              <div className="order-2 lg:order-1">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight title-entrance text-shift">
                    Our{' '}
                    <span className="text-[#F54927] relative gradient-text inline-block">
                      Multidisciplinary Team
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                    </span>
                  </h2>
                  <p className="text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed micro-float-up">
                    Our multidisciplinary team blends international standards with local expertise, leveraging advanced engineering tools 
                    to deliver innovative, high-quality solutions. We invest in staff development and training, ensuring technical excellence 
                    and consistent service delivery.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Link href="/teams" className="standard-button bg-[#042970] hover:bg-[#F54927] text-white px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base inline-flex items-center justify-center gap-2 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50">
                    Meet Our Team
                    <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform text-white" />
                  </Link>
                  <Link href="/vacancy" className="standard-button border-2 border-[#F54927] hover:bg-[#F54927] hover:text-white text-[#F54927] px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base inline-flex items-center justify-center gap-2 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50">
                    Join Our Team
                    <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform group-hover:text-white" />
                  </Link>
                </div>
              </div>

              {/* Right Side - Image with Enhanced Hover Effects */}
              <div className="order-1 lg:order-2 relative group">
                <div className="relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl border-4 border-transparent group-hover:border-[#F54927] transition-all duration-500">
                  <img
                    src="/images/about/bonga.jpg"
                    alt="Our Multidisciplinary Team"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 interactive-card-3d image-hover-effect"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/30 via-[#F54927]/20 to-[#042970]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Enhanced floating decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-[#F54927]/40 rounded-full blur-xl animate-float hidden lg:block group-hover:bg-[#F54927]/60 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 bg-[#042970]/40 rounded-full blur-xl animate-float-reverse hidden lg:block group-hover:bg-[#042970]/60 transition-colors duration-500" style={{ animationDelay: '1s' }}></div>
                  {/* Hover overlay text */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="text-white text-center px-4">
                      <p className="text-lg sm:text-xl font-bold mb-2">Expert Team</p>
                      <p className="text-sm sm:text-base">Dedicated Professionals</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </Reveal>

        {/* What We Do Section - Interactive Cards */}
        <Reveal variant="up" delay={200}>
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 title-entrance text-shift">
                What{' '}
                <span className="text-[#F54927] relative gradient-text">
                  We Do
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Comprehensive consulting services tailored to your project needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {services.map((service, index) => {
                const Icon = service.icon
                const serviceColors = [
                  'from-[#fff5f3] via-white to-[#f0f4ff]',
                  'from-[#f0f4ff] via-white to-[#fff5f3]',
                  'from-white via-[#fff5f3] to-[#f0f4ff]',
                  'from-[#f0f4ff] via-[#fff5f3] to-white',
                  'from-[#fff5f3] via-[#f0f4ff] to-white',
                  'from-white via-[#f0f4ff] to-[#fff5f3]'
                ]
                return (
                  <Reveal key={index} variant="up" delay={index * 100}>
                    <div
                      ref={(el) => { if (el) iconRefs.current[`service-${index}`] = el; }}
                      onMouseEnter={() => setHoveredCard(`service-${index}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`standard-card interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow hover:border-[#042970] group card-shimmer p-5 sm:p-6 h-full flex flex-col bg-gradient-to-br ${serviceColors[index % serviceColors.length]} hover:from-[#042970]/10 hover:via-[#042970]/5 hover:to-white transition-all duration-500`}
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F54927]/20 via-[#F54927]/15 to-[#F54927]/10 rounded-xl flex items-center justify-center mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float transition-all duration-500 card-icon-animate shadow-lg ${hoveredCard === `service-${index}` ? 'bg-gradient-to-br from-[#F54927] via-[#F54927]/90 to-[#F54927]/80 scale-125 rotate-6 shadow-2xl shadow-[#F54927]/50' : 'group-hover:from-[#F54927]/30 group-hover:via-[#F54927]/20 group-hover:to-[#F54927]/10'}`}>
                        <Icon className={`text-[#F54927] transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${hoveredCard === `service-${index}` ? 'text-white scale-125 rotate-12' : 'group-hover:text-[#F54927]'}`} style={{ width: '32px', height: '32px', fontWeight: 'bold' }} />
                      </div>
                      {/* Content */}
                      <div className="flex flex-col flex-grow">
                        <h4 className={`font-extrabold mb-2 text-base sm:text-lg md:text-xl card-text-animate transition-all duration-300 ${hoveredCard === `service-${index}` ? 'text-[#042970] scale-105' : 'text-gray-900 group-hover:text-[#042970]'}`}>{service.title}</h4>
                        <p className={`text-sm sm:text-base mb-4 leading-relaxed flex-grow transition-all duration-300 ${hoveredCard === `service-${index}` ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{service.description}</p>
                        <Link href="/projects" className={`text-sm sm:text-base font-bold transition-all duration-300 inline-flex items-center gap-2 group/link hover:gap-3 ${hoveredCard === `service-${index}` ? 'text-[#042970] scale-105' : 'text-[#F54927] hover:text-[#042970]'}`}>
                          View Projects
                          <HiOutlineArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform icon-full-color ${hoveredCard === `service-${index}` ? 'translate-x-2' : 'group-hover/link:translate-x-1'}`} />
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </Reveal>



        {/* Experience & Expertise with Side Image */}
        <Reveal variant="up" delay={400}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-10 sm:mb-12 md:mb-16">
            {/* Left Side - Image */}
            <div className="relative group order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
                <img
                  src="/images/about/Experience & Expertise.webp"
                  alt="Experience & Expertise"
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110 interactive-card-3d image-hover-effect"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to original image if new one doesn't exist
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/hero/industrialpark.jpg') {
                      target.src = '/images/hero/industrialpark.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#F54927]/30 to-[#042970]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6 title-entrance text-shift">
                Experience &{' '}
                <span className="text-[#042970] relative gradient-text">
                  Expertise
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                Over the years, the firm has successfully delivered projects including:
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6">
                {projectTypes.map((project, index) => {
                  const typeConfigs = [
                    { bg: 'from-[#fff5f3] to-white', border: 'border-[#F54927]' },
                    { bg: 'from-[#f0f4ff] to-white', border: 'border-[#042970]' },
                    { bg: 'from-[#fff5f3] to-[#f0f4ff]', border: 'border-[#F54927]' },
                    { bg: 'from-[#f0f4ff] to-[#fff5f3]', border: 'border-[#042970]' },
                    { bg: 'from-white to-[#fff5f3]', border: 'border-[#F54927]' }
                  ]
                  const config = typeConfigs[index % typeConfigs.length]
                  return (
                    <Reveal key={index} variant="up" delay={index * 50}>
                      <div className={`bg-gradient-to-r ${config.bg} p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-lg border-l-4 ${config.border} flex items-center gap-2 sm:gap-3 interactive-card-3d hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:from-[#F54927]/10 hover:to-white`}>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F54927]/20 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move icon-bounce icon-wiggle">
                          <HiOutlineCheckBadge className="text-[#F54927] text-lg sm:text-xl flex-shrink-0 icon-hover icon-glow icon-scale-pulse" style={{ width: '20px', height: '20px', fontWeight: 'bold' }} />
                        </div>
                        <span className="text-gray-700 font-semibold text-xs sm:text-sm md:text-base card-text-animate leading-tight hover:text-[#F54927] transition-colors">{project}</span>
            </div>
          </Reveal>
                  )
                })}
              </div>
              <p className="text-gray-800 mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
                Our founder, Engineer Endale Abdissa, brings extensive expertise in engineering, management, architectural design, and GIS-based planning.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link href="/projects" className="standard-button bg-[#F54927] hover:bg-[#042970] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm inline-flex items-center gap-2 group">
                  See Our Portfolio
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform icon-full-color" />
                </Link>
                <Link href="/about" className="standard-button border-2 border-[#042970] hover:bg-[#042970] hover:text-white text-[#042970] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm inline-flex items-center gap-2 group">
                  Learn More
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform icon-full-color" />
                </Link>
              </div>
            </div>
        </div>
        </Reveal>

        {/* Key Strengths */}
        <Reveal variant="up" delay={500}>
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 title-entrance text-shift">
                Key Strength{' '}
                <span className="text-[#F54927] relative gradient-text">
                  EF Engineering
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Excellence built on expertise, innovation, and unwavering commitment to quality
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {keyStrengths.map((strength, index) => {
                const Icon = strength.icon
                const strengthColors = [
                  'from-[#fff5f3] via-[#ffe5e0] to-[#fff5f3]',
                  'from-[#f0f4ff] via-[#e0e9ff] to-[#f0f4ff]',
                  'from-[#fff5f3] via-white to-[#f0f4ff]',
                  'from-[#f0f4ff] via-white to-[#fff5f3]',
                  'from-white via-[#fff5f3] to-[#f0f4ff]'
                ]
                return (
                  <Reveal key={index} variant="up" delay={index * 100}>
                    <div
                      onMouseEnter={() => setHoveredCard(`strength-${index}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`standard-card interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow hover:border-[#F54927] group card-shimmer p-5 sm:p-6 bg-gradient-to-br ${strengthColors[index % strengthColors.length]} hover:from-[#F54927]/20 hover:via-[#F54927]/10 hover:to-white transition-all duration-500`}
                    >
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-[#F54927]/30 via-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center flex-shrink-0 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float transition-all duration-500 card-icon-animate mx-auto sm:mx-0 shadow-lg ${hoveredCard === `strength-${index}` ? 'scale-125 rotate-6 bg-gradient-to-br from-[#F54927] via-[#F54927]/90 to-[#F54927]/80 shadow-2xl shadow-[#F54927]/50' : 'group-hover:from-[#F54927]/40 group-hover:via-[#F54927]/30 group-hover:to-[#F54927]/20'}`}>
                          <Icon className={`text-[#F54927] transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${hoveredCard === `strength-${index}` ? 'text-white scale-125 rotate-12' : ''}`} style={{ width: '40px', height: '40px', fontWeight: 'bold' }} />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
                          <h4 className={`font-extrabold mb-1.5 sm:mb-2 text-base sm:text-lg md:text-xl leading-[1.2] transition-all duration-300 micro-float-up text-shift card-text-animate ${hoveredCard === `strength-${index}` ? 'text-[#F54927] scale-105 font-black' : 'text-gray-900 group-hover:text-[#F54927]'}`}>
                            {strength.title}
                          </h4>
                          <p className={`text-xs sm:text-sm leading-relaxed micro-float-down card-lift-hover transition-all duration-300 ${hoveredCard === `strength-${index}` ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                            {strength.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Vision, Mission, Goal - Enhanced Interactive Cards */}
        <Reveal variant="up" delay={600}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-16">
            {/* Vision */}
            <div 
              onMouseEnter={() => setHoveredCard('vision')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`interactive-card-3d bg-gradient-to-br from-[#042970] via-[#042970] to-[#0a1a3a] p-5 sm:p-6 md:p-8 text-white shadow-2xl border-2 border-transparent transition-all duration-500 group rounded-xl ${
                hoveredCard === 'vision' 
                  ? 'hover:shadow-[0_0_50px_rgba(4,41,112,0.6)] hover:scale-105 hover:border-[#F54927]' 
                  : 'hover:shadow-[0_0_40px_rgba(4,41,112,0.4)]'
              }`}
            >
              <div className="flex flex-col items-center text-center mb-4 sm:mb-5 md:mb-6">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate transition-all duration-500 ${
                  hoveredCard === 'vision' 
                    ? 'bg-[#F54927]/30 scale-125 shadow-2xl shadow-[#F54927]/50' 
                    : 'bg-[#F54927]/10 group-hover:bg-[#F54927]/20'
                }`}>
                  <HiOutlineStar className={`text-white transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse ${
                    hoveredCard === 'vision' ? 'scale-125 rotate-12' : ''
                  }`} style={{ width: '36px', height: '36px', fontWeight: 'bold' }} />
                </div>
                <h4 className={`text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 sm:mb-4 title-entrance text-shift transition-all duration-300 ${
                  hoveredCard === 'vision' ? 'text-[#F54927] scale-105' : 'text-white group-hover:text-[#F54927]'
                }`}>Vision</h4>
              </div>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3 group/item hover:bg-[#F54927]/10 rounded-lg p-2 -m-2 transition-all duration-300">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-0.5 sm:mt-1 transition-all duration-300 ${
                    hoveredCard === 'vision' 
                      ? 'bg-[#F54927] scale-110 shadow-lg' 
                      : 'bg-[#F54927]/20 group-hover/item:bg-[#F54927]/30'
                  }`}>
                    <HiOutlineCheckBadge className={`text-[#F54927] text-base sm:text-lg icon-hover icon-glow transition-all duration-300 ${
                      hoveredCard === 'vision' ? 'text-white scale-110' : ''
                    }`} style={{ fontWeight: 'bold' }} />
                  </div>
                  <span className={`text-xs sm:text-sm md:text-base leading-relaxed card-text-animate transition-all duration-300 ${
                    hoveredCard === 'vision' 
                      ? 'text-white font-semibold' 
                      : 'text-white/95 group-hover/item:text-white'
                  }`}>Deliver world-class engineering services that meet global and national standards</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 group/item hover:bg-[#F54927]/10 rounded-lg p-2 -m-2 transition-all duration-300">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-0.5 sm:mt-1 transition-all duration-300 ${
                    hoveredCard === 'vision' 
                      ? 'bg-[#F54927] scale-110 shadow-lg' 
                      : 'bg-[#F54927]/20 group-hover/item:bg-[#F54927]/30'
                  }`}>
                    <HiOutlineCheckBadge className={`text-[#F54927] text-base sm:text-lg icon-hover icon-glow transition-all duration-300 ${
                      hoveredCard === 'vision' ? 'text-white scale-110' : ''
                    }`} style={{ fontWeight: 'bold' }} />
                  </div>
                  <span className={`text-xs sm:text-sm md:text-base leading-relaxed card-text-animate transition-all duration-300 ${
                    hoveredCard === 'vision' 
                      ? 'text-white font-semibold' 
                      : 'text-white/95 group-hover/item:text-white'
                  }`}>Become a leading consulting firm in Ethiopia, providing innovative and reliable solutions</span>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div 
              onMouseEnter={() => setHoveredCard('mission')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`interactive-card-3d bg-gradient-to-br from-[#F54927] via-[#F54927] to-[#d63e1f] p-5 sm:p-6 md:p-8 text-white shadow-2xl border-2 border-transparent transition-all duration-500 group rounded-xl ${
                hoveredCard === 'mission' 
                  ? 'hover:shadow-[0_0_50px_rgba(245,73,39,0.6)] hover:scale-105 hover:border-[#042970]' 
                  : 'hover:shadow-[0_0_40px_rgba(245,73,39,0.4)]'
              }`}
            >
              <div className="flex flex-col items-center text-center mb-4 sm:mb-5 md:mb-6">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate transition-all duration-500 ${
                  hoveredCard === 'mission' 
                    ? 'bg-[#042970]/30 scale-125 shadow-2xl shadow-[#042970]/50' 
                    : 'bg-[#042970]/10 group-hover:bg-[#042970]/20'
                }`}>
                  <HiOutlineRocketLaunch className={`text-white transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse ${
                    hoveredCard === 'mission' ? 'scale-125 rotate-12' : ''
                  }`} style={{ width: '36px', height: '36px', fontWeight: 'bold' }} />
                </div>
                <h4 className={`text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 sm:mb-4 title-entrance text-shift transition-all duration-300 ${
                  hoveredCard === 'mission' ? 'text-white scale-105 drop-shadow-lg' : 'text-white group-hover:drop-shadow-md'
                }`}>Mission</h4>
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 md:mb-6">
                <li className="flex items-start gap-2 sm:gap-3 group/item hover:bg-[#042970]/10 rounded-lg p-2 -m-2 transition-all duration-300">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-0.5 sm:mt-1 transition-all duration-300 ${
                    hoveredCard === 'mission' 
                      ? 'bg-[#042970] scale-110 shadow-lg' 
                      : 'bg-[#042970]/20 group-hover/item:bg-[#042970]/30'
                  }`}>
                    <HiOutlineCheckBadge className={`text-white text-base sm:text-lg icon-hover icon-glow transition-all duration-300 ${
                      hoveredCard === 'mission' ? 'text-white scale-110' : ''
                    }`} style={{ fontWeight: 'bold' }} />
                  </div>
                  <span className={`text-xs sm:text-sm md:text-base leading-relaxed card-text-animate transition-all duration-300 ${
                    hoveredCard === 'mission' 
                      ? 'text-white font-semibold' 
                      : 'text-white/95 group-hover/item:text-white'
                  }`}>Provide efficient, knowledgeable, and high-quality services to help clients achieve their goals</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 group/item hover:bg-[#042970]/10 rounded-lg p-2 -m-2 transition-all duration-300">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 icon-container icon-micro-move mt-0.5 sm:mt-1 transition-all duration-300 ${
                    hoveredCard === 'mission' 
                      ? 'bg-[#042970] scale-110 shadow-lg' 
                      : 'bg-[#042970]/20 group-hover/item:bg-[#042970]/30'
                  }`}>
                    <HiOutlineCheckBadge className={`text-white text-base sm:text-lg icon-hover icon-glow transition-all duration-300 ${
                      hoveredCard === 'mission' ? 'text-white scale-110' : ''
                    }`} style={{ fontWeight: 'bold' }} />
                  </div>
                  <span className={`text-xs sm:text-sm md:text-base leading-relaxed card-text-animate transition-all duration-300 ${
                    hoveredCard === 'mission' 
                      ? 'text-white font-semibold' 
                      : 'text-white/95 group-hover/item:text-white'
                  }`}>Utilize company resources effectively to exceed client expectations</span>
                </li>
              </ul>
              <div className="mt-4 sm:mt-5 md:mt-6 text-center">
                <Link href="/vacancy" className={`standard-button px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 sm:gap-2 group transition-all duration-300 ${
                  hoveredCard === 'mission' 
                    ? 'bg-[#042970] text-white hover:bg-[#042970]/90 scale-105 shadow-xl shadow-[#042970]/50' 
                    : 'bg-[#042970] text-white hover:bg-[#042970]/90 hover:scale-105 hover:shadow-lg'
                }`}>
                  Join Us / Work With Us
                  <HiOutlineArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform text-white ${
                    hoveredCard === 'mission' ? 'translate-x-2' : 'group-hover:translate-x-2'
                  }`} />
                </Link>
              </div>
            </div>

            {/* Goal */}
            <div 
              onMouseEnter={() => setHoveredCard('goal')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`interactive-card-3d bg-gradient-to-br from-[#042970] via-[#042970] to-[#0a1a3a] p-5 sm:p-6 md:p-8 text-white shadow-2xl border-2 border-transparent transition-all duration-500 group rounded-xl ${
                hoveredCard === 'goal' 
                  ? 'hover:shadow-[0_0_50px_rgba(4,41,112,0.6)] hover:scale-105 hover:border-[#F54927]' 
                  : 'hover:shadow-[0_0_40px_rgba(4,41,112,0.4)]'
              }`}
            >
              <div className="flex flex-col items-center text-center mb-4 sm:mb-5 md:mb-6">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate transition-all duration-500 ${
                  hoveredCard === 'goal' 
                    ? 'bg-[#F54927]/30 scale-125 shadow-2xl shadow-[#F54927]/50' 
                    : 'bg-[#F54927]/10 group-hover:bg-[#F54927]/20'
                }`}>
                  <HiOutlineArrowTrendingUp className={`text-white transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse ${
                    hoveredCard === 'goal' ? 'scale-125 rotate-12' : ''
                  }`} style={{ width: '36px', height: '36px', fontWeight: 'bold' }} />
                </div>
                <h4 className={`text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 sm:mb-4 title-entrance text-shift transition-all duration-300 ${
                  hoveredCard === 'goal' ? 'text-[#F54927] scale-105' : 'text-white group-hover:text-[#F54927]'
                }`}>Goal</h4>
              </div>
              <p className={`text-center mb-6 sm:mb-7 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed card-text-animate px-2 transition-all duration-300 ${
                hoveredCard === 'goal' 
                  ? 'text-white font-semibold' 
                  : 'text-white/95 group-hover:text-white'
              }`}>
                Build a company that fully satisfies clients and empowers its staff
              </p>
              <div className="text-center">
                <Link href="/contact" className={`standard-button px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 sm:gap-2 group transition-all duration-300 ${
                  hoveredCard === 'goal' 
                    ? 'bg-[#F54927] text-white hover:bg-[#d63e1f] scale-105 shadow-xl shadow-[#F54927]/50' 
                    : 'bg-[#F54927] text-white hover:bg-[#d63e1f] hover:scale-105 hover:shadow-lg'
                }`}>
                  Contact Us / Request Consultation
                  <HiOutlineArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform text-white ${
                    hoveredCard === 'goal' ? 'translate-x-2' : 'group-hover:translate-x-2'
                  }`} />
                </Link>
              </div>
            </div>
          </div>
          </Reveal>

        {/* Company Objectives Section - Redesigned from Home Page */}
        <Reveal variant="up" delay={700}>
          <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            {/* Title and Subtitle - Top Center - Interactive */}
            <div className="text-center mb-6 sm:mb-8 group/header">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 title-entrance text-shift group-hover/header:scale-105 transition-transform duration-300">
                Company{' '}
                <span className="text-[#F54927] relative inline-block group-hover/header:text-[#042970] transition-colors duration-300">
                  Objectives
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand group-hover/header:bg-[#F54927] transition-colors duration-300"></span>
                </span>
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-700 text-base sm:text-lg md:text-xl font-semibold leading-relaxed group-hover/header:text-gray-800 transition-colors duration-300">
                Our commitment to excellence and continuous improvement
              </p>
            </div>
                </div>

            {/* Main Layout - Content and Image Side by Side - Redesigned */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start">
              {/* Left Side - Objectives Cards */}
              <div className="w-full flex flex-col justify-center order-2 lg:order-1">
                {/* Objectives Grid - Well-Placed Interactive Design */}
                <div className="grid grid-cols-1 gap-3 md:gap-4 overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl">
                  {[
                    {
                      text: 'We will provide consistent services that meet customer and applicable regulatory requirements.',
                      gradient: 'from-[#F54927] via-[#F54927] to-[#d63e1f]'
                    },
                    {
                      text: 'To provide a quality consultancy service saving our clients\' money & time.',
                      gradient: 'from-[#042970] via-[#042970] to-[#0a1a3a]'
                    },
                    {
                      text: 'We will achieve 100% customer satisfaction through the intensive application and maintenance of the quality management system by the end of 2023.',
                      gradient: 'from-[#10B981] via-[#059669] to-[#047857]'
                    },
                    {
                      text: 'We will provide training for all the company employees every six months starting September 2022 and we will evaluate its contribution to the company.',
                      gradient: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]'
                    }
                  ].map((item, index) => {
                    return (
                      <Reveal key={index} variant="up" delay={700 + (index * 100)}>
                        <div 
                          onMouseEnter={() => setHoveredCard(`objective-${index}`)}
                          onMouseLeave={() => setHoveredCard(null)}
                          className={`relative group/card h-auto transition-all duration-300 cursor-pointer ${
                            hoveredCard === `objective-${index}` 
                              ? 'z-10 transform-gpu scale-[1.02]' 
                              : 'hover:scale-[1.01] transform-gpu'
                          }`}
                        >
                          {/* Card Background - Colorful Gradient - Well-Placed Design */}
                          <div className={`relative h-auto p-3 md:p-4 lg:p-5 overflow-hidden transition-all duration-300 bg-gradient-to-br ${item.gradient} text-white max-w-full rounded-lg md:rounded-xl shadow-md md:shadow-lg ${
                            hoveredCard === `objective-${index}` 
                              ? 'shadow-xl md:shadow-2xl shadow-[#F54927]/50 ring-2 ring-white/40 scale-[1.02] z-10' 
                              : 'hover:shadow-lg md:hover:shadow-xl hover:scale-[1.01]'
                          }`}>
                            {/* Animated Background Pattern */}
                            <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${
                              hoveredCard === `objective-${index}` ? 'opacity-25' : 'group-hover/card:opacity-15'
                            }`}>
                              <div className="absolute inset-0" style={{
                                backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 50%, transparent 50%)`,
                                backgroundSize: '20px 20px',
                                animation: hoveredCard === `objective-${index}` ? 'pulse 2s ease-in-out infinite' : 'none'
                              }}></div>
                            </div>

                            {/* Number Badge - Left Side - Well-Placed */}
                            <div className={`absolute top-3 md:top-4 left-3 md:left-4 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-extrabold text-sm md:text-base transition-all duration-300 bg-white/30 backdrop-blur-sm shadow-lg ${
                              hoveredCard === `objective-${index}` 
                                ? 'scale-125 rotate-12 bg-white/60 shadow-xl ring-2 ring-white/70' 
                                : 'group-hover/card:scale-110 group-hover/card:rotate-6 group-hover/card:bg-white/40'
                            }`}>
                              {index + 1}
                            </div>
                            
                            {/* Content - Well-Placed Font Size */}
                            <div className="relative z-10 pl-12 md:pl-14 lg:pl-16 pr-3">
                              <p className={`text-sm md:text-base lg:text-lg leading-relaxed transition-all duration-300 text-white ${
                                hoveredCard === `objective-${index}` 
                                  ? 'font-bold' 
                                  : 'font-medium group-hover/card:font-semibold'
                              }`}>
                                {item.text}
                </p>
              </div>

                            {/* Hover Effect - Shine Animation */}
                            <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none ${
                              hoveredCard === `objective-${index}` ? 'opacity-100' : 'group-hover/card:opacity-100'
                            }`}>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                      </div>
                            
                            {/* Interactive Border Glow */}
                            <div className={`absolute inset-0 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                              hoveredCard === `objective-${index}` 
                                ? 'border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.3)]' 
                                : 'border-transparent group-hover/card:border-white/30'
                            }`}></div>
                            
                            {/* Glow Effect - Enhanced */}
                            <div className={`absolute -inset-1 opacity-0 transition-opacity duration-300 blur-xl ${
                              hoveredCard === `objective-${index}` ? 'opacity-60' : 'group-hover/card:opacity-30'
                            }`} style={{
                              background: `linear-gradient(135deg, ${item.gradient.includes('#F54927') ? '#F54927' : item.gradient.includes('#042970') ? '#042970' : item.gradient.includes('#10B981') ? '#10B981' : '#8B5CF6'}, transparent)`
                            }}></div>
                            
                            {/* Ripple Effect on Click */}
                            <div className={`absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 ${
                              hoveredCard === `objective-${index}` ? 'opacity-20' : ''
                            }`}>
                              <div className="absolute inset-0 bg-white/20 animate-ping"></div>
                            </div>
                          </div>
                    </div>
                  </Reveal>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Image - Well-Placed Design */}
              <div className="flex justify-center lg:justify-end items-center order-1 lg:order-2 h-full">
                <div className="relative w-full max-w-md lg:max-w-lg h-auto flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                  <img
                    src="/images/objective.webp"
                    alt="Company Objectives"
                    className="w-full h-auto max-h-[65vh] object-contain object-center rounded-lg md:rounded-xl"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quality Policy Section - Redesigned with Colorful Cards */}
        <Reveal variant="up" delay={800}>
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 mb-10 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 title-entrance text-shift">
                Quality{' '}
                <span className="text-[#042970] relative gradient-text">
                  Policy
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Our commitment to delivering excellence in every project
              </p>
            </div>

            {/* Colorful Achievement Cards - Top Section */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center title-entrance text-shift">
                This will be achieved by:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {[
                  { text: 'Implementing ISO 9001:2008 QMS', gradient: 'from-[#F54927] via-[#F54927] to-[#d63e1f]', icon: HiOutlineShieldCheck },
                  { text: 'Communicating the spirit to employee', gradient: 'from-[#042970] via-[#042970] to-[#0a1a3a]', icon: HiOutlineChatBubbleLeftRight },
                  { text: 'Improving competence of employee through training and Effective Communication', gradient: 'from-[#10B981] via-[#059669] to-[#047857]', icon: HiOutlineAcademicCap },
                  { text: 'Collecting feedback from customer', gradient: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]', icon: HiOutlineUserGroup },
                  { text: 'Continual improvement of Quality Management System', gradient: 'from-[#F59E0B] via-[#D97706] to-[#B45309]', icon: HiOutlineArrowTrendingUp },
                  { text: 'Abiding applicable regulatory requirements and ethical norms', gradient: 'from-[#EF4444] via-[#DC2626] to-[#B91C1C]', icon: HiOutlineDocumentCheck },
                  { text: 'Making comfortable working environment with high aesthetic standards', gradient: 'from-[#06B6D4] via-[#0891B2] to-[#0E7490]', icon: HiOutlineBuildingOffice2 },
                  { text: 'Motivating employee by apprising', gradient: 'from-[#EC4899] via-[#DB2777] to-[#BE185D]', icon: HiOutlineTrophy }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Reveal key={index} variant="up" delay={800 + (index * 50)}>
                      <div 
                        onMouseEnter={() => setHoveredCard(`quality-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`relative group/card h-auto transition-all duration-300 cursor-pointer ${
                          hoveredCard === `quality-${index}` 
                            ? 'z-10 transform-gpu scale-[1.05]' 
                            : 'hover:scale-[1.02] transform-gpu'
                        }`}
                      >
                        {/* Colorful Card Background */}
                        <div className={`relative h-full p-4 sm:p-5 overflow-hidden transition-all duration-300 bg-gradient-to-br ${item.gradient} text-white rounded-lg md:rounded-xl shadow-md md:shadow-lg ${
                          hoveredCard === `quality-${index}` 
                            ? 'shadow-xl md:shadow-2xl shadow-[#F54927]/50 ring-2 ring-white/40 scale-[1.05] z-10' 
                            : 'hover:shadow-lg md:hover:shadow-xl hover:scale-[1.02]'
                        }`}>
                          {/* Animated Background Pattern */}
                          <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${
                            hoveredCard === `quality-${index}` ? 'opacity-25' : 'group-hover/card:opacity-15'
                          }`}>
                            <div className="absolute inset-0" style={{
                              backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 50%, transparent 50%)`,
                              backgroundSize: '15px 15px',
                            }}></div>
                  </div>

                          {/* Icon */}
                          <div className={`relative z-10 mb-3 flex items-center justify-center ${
                            hoveredCard === `quality-${index}` ? 'scale-110' : 'group-hover/card:scale-105'
                          } transition-transform duration-300`}>
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                              hoveredCard === `quality-${index}` 
                                ? 'bg-white/40 scale-125 rotate-12 shadow-xl ring-2 ring-white/70' 
                                : 'group-hover/card:bg-white/30 group-hover/card:rotate-6'
                            }`}>
                              <Icon className="text-white transition-all duration-300" style={{ width: '24px', height: '24px', fontWeight: 'bold' }} />
                </div>
                          </div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <p className={`text-xs sm:text-sm md:text-base leading-relaxed transition-all duration-300 text-white text-center ${
                              hoveredCard === `quality-${index}` 
                                ? 'font-bold' 
                                : 'font-medium group-hover/card:font-semibold'
                            }`}>
                              {item.text}
                </p>
              </div>

                          {/* Hover Effect - Shine Animation */}
                          <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none ${
                            hoveredCard === `quality-${index}` ? 'opacity-100' : 'group-hover/card:opacity-100'
                          }`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                        </div>
                          
                          {/* Interactive Border Glow */}
                          <div className={`absolute inset-0 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                            hoveredCard === `quality-${index}` 
                              ? 'border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                              : 'border-transparent group-hover/card:border-white/30'
                          }`}></div>
                          
                          {/* Glow Effect */}
                          <div className={`absolute -inset-1 opacity-0 transition-opacity duration-300 blur-xl ${
                            hoveredCard === `quality-${index}` ? 'opacity-50' : 'group-hover/card:opacity-25'
                          }`} style={{
                            background: `linear-gradient(135deg, ${item.gradient.includes('#F54927') ? '#F54927' : item.gradient.includes('#042970') ? '#042970' : item.gradient.includes('#10B981') ? '#10B981' : item.gradient.includes('#F59E0B') ? '#F59E0B' : item.gradient.includes('#EF4444') ? '#EF4444' : item.gradient.includes('#06B6D4') ? '#06B6D4' : '#EC4899'}, transparent)`
                          }}></div>
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
                </div>
              </div>

            {/* Quality Policy Statement - Colorful Interactive Card */}
            <Reveal variant="up" delay={1200}>
              <div 
                onMouseEnter={() => setHoveredCard('quality-policy')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group/card transition-all duration-500 cursor-pointer mt-10 sm:mt-12 md:mt-16 lg:mt-20 ${
                  hoveredCard === 'quality-policy' 
                    ? 'z-10 transform-gpu scale-[1.02]' 
                    : 'hover:scale-[1.01] transform-gpu'
                }`}
              >
                {/* Colorful Gradient Background with Multiple Layers */}
                <div className={`relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-[#F54927] via-[#042970] via-[#10B981] to-[#8B5CF6] p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl shadow-2xl text-white ${
                  hoveredCard === 'quality-policy' 
                    ? 'shadow-[0_0_60px_rgba(245,73,39,0.6)] ring-4 ring-white/30' 
                    : 'hover:shadow-[0_0_40px_rgba(4,41,112,0.5)]'
                }`}>
                  {/* Animated Background Pattern */}
                  <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${
                    hoveredCard === 'quality-policy' ? 'opacity-40' : 'group-hover/card:opacity-30'
                  }`}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 50%, transparent 50%)`,
                      backgroundSize: '30px 30px',
                      animation: hoveredCard === 'quality-policy' ? 'pulse 3s ease-in-out infinite' : 'none'
                    }}></div>
            </div>

                  {/* Floating Particles Effect */}
                  <div className={`absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl pointer-events-none transition-opacity duration-500 ${
                    hoveredCard === 'quality-policy' ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                  }`}>
                    <div className="absolute top-10 left-10 w-3 h-3 bg-white/40 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-float-reverse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/30 rounded-full animate-float-reverse" style={{ animationDelay: '0.5s' }}></div>
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center mb-6 sm:mb-8">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate transition-all duration-500 bg-white/20 backdrop-blur-sm shadow-xl ${
                        hoveredCard === 'quality-policy' 
                          ? 'bg-white/40 scale-125 rotate-12 shadow-2xl ring-4 ring-white/50' 
                          : 'group-hover/card:bg-white/30 group-hover/card:scale-110 group-hover/card:rotate-6'
                      }`}>
                        <HiOutlineShieldCheck className={`text-white transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${
                          hoveredCard === 'quality-policy' ? 'scale-125' : ''
                        }`} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />
                      </div>
                      <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-5 md:mb-6 text-center title-entrance text-shift transition-all duration-300 ${
                        hoveredCard === 'quality-policy' ? 'scale-105 drop-shadow-2xl' : 'group-hover/card:scale-105'
                      }`}>
                        Quality Policy
                      </h3>
                    </div>

                    {/* Policy Text */}
                    <div className="max-w-4xl mx-auto">
                      <p className={`text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-center card-text-animate transition-all duration-300 px-2 sm:px-4 ${
                        hoveredCard === 'quality-policy' 
                          ? 'font-semibold drop-shadow-lg' 
                          : 'font-medium group-hover/card:font-semibold'
                      }`}>
                        EF Architects and Engineers Consulting Plc is a company which provides high standard, cost efficient, quality and creative nature Architectural and engineering services to the construction industry by realistic cost, on timely bases and to high satisfaction of customers.
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect - Shine Animation */}
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none rounded-xl sm:rounded-2xl ${
                    hoveredCard === 'quality-policy' ? 'opacity-100' : 'group-hover/card:opacity-100'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                  </div>
                  
                  {/* Interactive Border Glow */}
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-3 transition-all duration-300 ${
                    hoveredCard === 'quality-policy' 
                      ? 'border-white/70 shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                      : 'border-transparent group-hover/card:border-white/40'
                  }`}></div>
                  
                  {/* Multi-layer Glow Effects */}
                  <div className={`absolute -inset-2 opacity-0 transition-opacity duration-500 blur-2xl ${
                    hoveredCard === 'quality-policy' ? 'opacity-70' : 'group-hover/card:opacity-40'
                  }`} style={{
                    background: 'linear-gradient(135deg, #F54927, #042970, #10B981, #8B5CF6)'
                  }}></div>
                  
                  {/* Secondary Glow Layer */}
                  <div className={`absolute -inset-4 opacity-0 transition-opacity duration-700 blur-3xl ${
                    hoveredCard === 'quality-policy' ? 'opacity-50' : 'group-hover/card:opacity-30'
                  }`} style={{
                    background: 'linear-gradient(135deg, #042970, #F54927)',
                    animationDelay: '0.2s'
                  }}></div>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* Compliance with Applicable Codes Section - Redesigned */}
        <Reveal variant="up" delay={900}>
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 mb-10 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 title-entrance text-shift">
                Compliance with{' '}
                <span className="text-[#F54927] relative gradient-text">
                  Applicable Codes
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#042970] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Adhering to international and national standards for structural design
              </p>
            </div>

            {/* Main Statement - Colorful Interactive Card */}
            <Reveal variant="up" delay={1000}>
              <div 
                onMouseEnter={() => setHoveredCard('compliance-statement')}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group/card transition-all duration-500 cursor-pointer mb-8 sm:mb-10 md:mb-12 lg:mb-16 ${
                  hoveredCard === 'compliance-statement' 
                    ? 'z-10 transform-gpu scale-[1.02]' 
                    : 'hover:scale-[1.01] transform-gpu'
                }`}
              >
                {/* Colorful Gradient Background */}
                <div className={`relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-[#042970] via-[#10B981] via-[#F54927] to-[#8B5CF6] p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl shadow-2xl text-white ${
                  hoveredCard === 'compliance-statement' 
                    ? 'shadow-[0_0_60px_rgba(4,41,112,0.6)] ring-4 ring-white/30' 
                    : 'hover:shadow-[0_0_40px_rgba(4,41,112,0.5)]'
                }`}>
                  {/* Animated Background Pattern */}
                  <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${
                    hoveredCard === 'compliance-statement' ? 'opacity-40' : 'group-hover/card:opacity-30'
                  }`}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 50%, transparent 50%)`,
                      backgroundSize: '30px 30px',
                      animation: hoveredCard === 'compliance-statement' ? 'pulse 3s ease-in-out infinite' : 'none'
                    }}></div>
                  </div>

                  {/* Floating Particles Effect */}
                  <div className={`absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl pointer-events-none transition-opacity duration-500 ${
                    hoveredCard === 'compliance-statement' ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                  }`}>
                    <div className="absolute top-10 left-10 w-3 h-3 bg-white/40 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-float-reverse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/30 rounded-full animate-float-reverse" style={{ animationDelay: '0.5s' }}></div>
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10">
                    {/* Icon and Title */}
              <div className="flex flex-col items-center mb-6 sm:mb-8">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float card-icon-animate transition-all duration-500 bg-white/20 backdrop-blur-sm shadow-xl ${
                        hoveredCard === 'compliance-statement' 
                          ? 'bg-white/40 scale-125 rotate-12 shadow-2xl ring-4 ring-white/50' 
                          : 'group-hover/card:bg-white/30 group-hover/card:scale-110 group-hover/card:rotate-6'
                      }`}>
                        <HiOutlineBookOpen className={`text-white transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${
                          hoveredCard === 'compliance-statement' ? 'scale-125' : ''
                        }`} style={{ width: '48px', height: '48px', fontWeight: 'bold' }} />
                </div>
                    </div>

                    {/* Statement Text */}
                    <div className="max-w-4xl mx-auto">
                      <p className={`text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-center card-text-animate transition-all duration-300 px-2 sm:px-4 ${
                        hoveredCard === 'compliance-statement' 
                          ? 'font-semibold drop-shadow-lg' 
                          : 'font-medium group-hover/card:font-semibold'
                      }`}>
                  EF Architects and Engineers Consulting Plc uses by squeezing Ethiopia Building Code of Standard (EBCS), Ethiopian Standard Code of Practice (ESCP), Euro Code 2-1992 (used by the software), regional and national standards according to the requirement of the requirement of the civil Structures design.
                </p>
              </div>
                      </div>

                  {/* Hover Effect - Shine Animation */}
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none rounded-xl sm:rounded-2xl ${
                    hoveredCard === 'compliance-statement' ? 'opacity-100' : 'group-hover/card:opacity-100'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                  </div>
                  
                  {/* Interactive Border Glow */}
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-3 transition-all duration-300 ${
                    hoveredCard === 'compliance-statement' 
                      ? 'border-white/70 shadow-[0_0_30px_rgba(255,255,255,0.4)]' 
                      : 'border-transparent group-hover/card:border-white/40'
                  }`}></div>
                  
                  {/* Multi-layer Glow Effects */}
                  <div className={`absolute -inset-2 opacity-0 transition-opacity duration-500 blur-2xl ${
                    hoveredCard === 'compliance-statement' ? 'opacity-70' : 'group-hover/card:opacity-40'
                  }`} style={{
                    background: 'linear-gradient(135deg, #042970, #10B981, #F54927, #8B5CF6)'
                  }}></div>
                  
                  {/* Secondary Glow Layer */}
                  <div className={`absolute -inset-4 opacity-0 transition-opacity duration-700 blur-3xl ${
                    hoveredCard === 'compliance-statement' ? 'opacity-50' : 'group-hover/card:opacity-30'
                  }`} style={{
                    background: 'linear-gradient(135deg, #042970, #F54927)',
                    animationDelay: '0.2s'
                  }}></div>
                </div>
                    </div>
                  </Reveal>

            {/* Code Cards - Colorful Interactive Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[
                { name: 'EBCS', fullName: 'Ethiopia Building Code of Standard', gradient: 'from-[#F54927] via-[#F54927] to-[#d63e1f]', icon: HiOutlineDocumentCheck },
                { name: 'ESCP', fullName: 'Ethiopian Standard Code of Practice', gradient: 'from-[#042970] via-[#042970] to-[#0a1a3a]', icon: HiOutlineDocumentCheck },
                { name: 'Euro Code 2-1992', fullName: 'Euro Code 2-1992 (Software Standard)', gradient: 'from-[#10B981] via-[#059669] to-[#047857]', icon: HiOutlineDocumentCheck },
                { name: 'Regional & National', fullName: 'Regional and National Standards', gradient: 'from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]', icon: HiOutlineDocumentCheck }
              ].map((code, index) => {
                const Icon = code.icon
                return (
                  <Reveal key={index} variant="up" delay={1100 + (index * 100)}>
                    <div 
                      onMouseEnter={() => setHoveredCard(`code-${index}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`relative group/card h-full transition-all duration-300 cursor-pointer ${
                        hoveredCard === `code-${index}` 
                          ? 'z-10 transform-gpu scale-[1.05]' 
                          : 'hover:scale-[1.02] transform-gpu'
                      }`}
                    >
                      {/* Colorful Card Background */}
                      <div className={`relative h-full p-4 sm:p-5 md:p-6 overflow-hidden transition-all duration-300 bg-gradient-to-br ${code.gradient} text-white rounded-lg md:rounded-xl shadow-md md:shadow-lg ${
                        hoveredCard === `code-${index}` 
                          ? 'shadow-xl md:shadow-2xl shadow-[#F54927]/50 ring-2 ring-white/40 scale-[1.05] z-10' 
                          : 'hover:shadow-lg md:hover:shadow-xl hover:scale-[1.02]'
                      }`}>
                        {/* Animated Background Pattern */}
                        <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${
                          hoveredCard === `code-${index}` ? 'opacity-25' : 'group-hover/card:opacity-15'
                        }`}>
                          <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 50%, transparent 50%)`,
                            backgroundSize: '15px 15px',
                          }}></div>
              </div>

                        {/* Icon */}
                        <div className={`relative z-10 mb-3 sm:mb-4 flex items-center justify-center ${
                          hoveredCard === `code-${index}` ? 'scale-110' : 'group-hover/card:scale-105'
                        } transition-transform duration-300`}>
                          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                            hoveredCard === `code-${index}` 
                              ? 'bg-white/40 scale-125 rotate-12 shadow-xl ring-2 ring-white/70' 
                              : 'group-hover/card:bg-white/30 group-hover/card:rotate-6'
                          }`}>
                            <Icon className="text-white transition-all duration-300" style={{ width: '28px', height: '28px', fontWeight: 'bold' }} />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <h4 className={`text-base sm:text-lg md:text-xl font-extrabold mb-2 sm:mb-3 text-center transition-all duration-300 ${
                            hoveredCard === `code-${index}` 
                              ? 'font-black scale-105' 
                              : 'group-hover/card:font-black'
                          }`}>
                            {code.name}
                          </h4>
                          <p className={`text-xs sm:text-sm md:text-base leading-relaxed transition-all duration-300 text-white text-center ${
                            hoveredCard === `code-${index}` 
                              ? 'font-semibold' 
                              : 'font-medium group-hover/card:font-semibold'
                          }`}>
                            {code.fullName}
                          </p>
                        </div>

                        {/* Hover Effect - Shine Animation */}
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none ${
                          hoveredCard === `code-${index}` ? 'opacity-100' : 'group-hover/card:opacity-100'
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                        </div>
                        
                        {/* Interactive Border Glow */}
                        <div className={`absolute inset-0 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                          hoveredCard === `code-${index}` 
                            ? 'border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                            : 'border-transparent group-hover/card:border-white/30'
                        }`}></div>
                        
                        {/* Glow Effect */}
                        <div className={`absolute -inset-1 opacity-0 transition-opacity duration-300 blur-xl ${
                          hoveredCard === `code-${index}` ? 'opacity-50' : 'group-hover/card:opacity-25'
                        }`} style={{
                          background: `linear-gradient(135deg, ${code.gradient.includes('#F54927') ? '#F54927' : code.gradient.includes('#042970') ? '#042970' : code.gradient.includes('#10B981') ? '#10B981' : '#8B5CF6'}, transparent)`
                        }}></div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <section id="about-stats" className="bg-white py-10 mb-10 sm:mb-12 md:mb-16 standard-card engineering-bg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {counters.map((c, i) => (
              <Reveal variant="up" delay={i * 100} key={c.label}>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent" style={{ WebkitTextStroke: '2px #042970' }}>{nums[i]}+</div>
                  <div className="uppercase tracking-wide text-gray-600 mt-2 text-xs sm:text-sm">{c.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* General Experience - Interactive with Categories */}
        <Reveal variant="up" delay={700}>
          <div className="mb-10 sm:mb-12 md:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3 title-entrance text-shift">
                General{' '}
                <span className="text-[#042970] relative gradient-text">
                  Experience
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                We actively engage clients and communities to deliver reliable and high-quality engineering services across diverse sectors
              </p>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#042970] to-[#042970] text-white shadow-lg shadow-[#042970]/50 scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#F54927] hover:text-[#F54927] hover:shadow-md'
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <span className="ml-2 inline-block animate-bounce">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid with Category Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {filteredProjects.map((project, index) => {
                const Icon = project.icon
                const projectColors = [
                  'from-[#fff5f3] via-white to-[#fff5f3]',
                  'from-[#f0f4ff] via-white to-[#f0f4ff]',
                  'from-white via-[#fff5f3] to-white',
                  'from-[#fff5f3] via-[#f0f4ff] to-[#fff5f3]',
                  'from-[#f0f4ff] via-white to-[#fff5f3]',
                  'from-white via-[#f0f4ff] to-white',
                  'from-[#fff5f3] via-white to-[#f0f4ff]',
                  'from-[#f0f4ff] via-[#fff5f3] to-white',
                  'from-white via-[#f0f4ff] to-[#fff5f3]',
                  'from-[#fff5f3] via-[#f0f4ff] to-white',
                  'from-[#f0f4ff] via-white to-[#fff5f3]',
                  'from-white via-[#fff5f3] to-[#f0f4ff]',
                  'from-[#fff5f3] via-[#f0f4ff] to-white'
                ]
                const cardId = `project-${index}`
                return (
                  <Reveal key={index} variant="up" delay={index * 50}>
                    <div
                      onMouseEnter={() => setHoveredCard(cardId)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`standard-card interactive-card-3d card-gradient-animated card-shadow-animated card-border-glow hover:border-[#042970] group card-shimmer p-5 sm:p-6 h-full flex flex-col bg-gradient-to-br ${projectColors[index % projectColors.length]} hover:from-[#042970]/15 hover:via-[#042970]/10 hover:to-white transition-all duration-500`}
                    >
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                          hoveredCard === cardId
                            ? 'bg-[#042970] text-white scale-110'
                            : 'bg-[#042970]/10 text-[#042970] group-hover:bg-[#042970]/20'
                        }`}>
                          {project.category}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#042970]/20 via-[#042970]/15 to-[#042970]/10 rounded-xl flex items-center justify-center mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float transition-all duration-500 card-icon-animate shadow-lg ${
                        hoveredCard === cardId 
                          ? 'bg-gradient-to-br from-[#042970] via-[#042970]/90 to-[#042970]/80 scale-125 rotate-6 shadow-2xl shadow-[#042970]/50' 
                          : 'group-hover:from-[#042970]/30 group-hover:via-[#042970]/20 group-hover:to-[#042970]/10'
                      }`}>
                        <Icon className={`text-[#042970] transition-all duration-500 icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color ${
                          hoveredCard === cardId 
                            ? 'text-white scale-125 rotate-12' 
                            : 'group-hover:text-[#042970]'
                        }`} style={{ width: '32px', height: '32px', fontWeight: 'bold' }} />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow">
                        <h4 className={`font-extrabold mb-2 text-base sm:text-lg md:text-xl card-text-animate transition-all duration-300 ${
                          hoveredCard === cardId 
                            ? 'text-[#042970] scale-105' 
                            : 'text-gray-900 group-hover:text-[#042970]'
                        }`}>
                          {project.name}
                        </h4>
                        <p className={`text-sm sm:text-base mb-4 leading-relaxed flex-grow transition-all duration-300 ${
                          hoveredCard === cardId 
                            ? 'text-gray-800 font-medium' 
                            : 'text-gray-600'
                        }`}>
                          {project.description}
                        </p>
                        <Link 
                          href="/projects" 
                          className={`text-sm sm:text-base font-bold transition-all duration-300 inline-flex items-center gap-2 group/link hover:gap-3 ${
                            hoveredCard === cardId 
                              ? 'text-[#F54927] scale-105' 
                              : 'text-[#042970] hover:text-[#F54927]'
                          }`}
                        >
                          View Project Details
                          <HiOutlineArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform icon-full-color ${
                            hoveredCard === cardId 
                              ? 'translate-x-2' 
                              : 'group-hover/link:translate-x-1'
                          }`} />
                        </Link>
                      </div>
            </div>
          </Reveal>
                )
              })}
                  </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
            )}
              </div>
            </Reveal>

        {/* Team Section - Enhanced with Auto-Scroll */}
        <section className="mb-16">
        <Reveal variant="up">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-[#F54927] tracking-[.25em] uppercase text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Our Team</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-5">
                Our Expert{' '}
                <span className="text-[#042970] relative gradient-text inline-block">
                  Engineering Team
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
                </span>
              </h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                Meet the talented professionals driving innovation and excellence in every project
              </p>
            </div>
        </Reveal>
          {/* Horizontal Scrolling Container */}
          <div 
            ref={teamScrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 -mx-4 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="flex gap-4 sm:gap-5 md:gap-6" style={{ width: 'max-content' }}>
              {(teamLoading ? new Array(6).fill(null) : (team || [])).map((member, idx) => (
                <Reveal variant="up" delay={idx*50} key={member?.id ?? idx}>
                  <div className="standard-card interactive-card-3d bg-white shadow-sm relative overflow-hidden rounded-md flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]">
                  <img
                    src={member?.photo || '/images/hero/3d4.jpg'}
                    alt={member ? `${member.f_name ?? ''} ${member.m_name ?? ''} ${member.l_name ?? ''}`.trim() : 'Team Member'}
                      className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#141414] text-white">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-extrabold leading-none text-sm truncate">{member ? `${member.f_name ?? ''} ${member.m_name ?? ''} ${member.l_name ?? ''}`.trim() : 'Loading…'}</div>
                          <div className="text-xs text-white/70 mt-1 truncate">{member?.profession || 'Project Manager'}</div>
                      </div>
                        <a href={member?.linkedin || '#'} className="text-[#F54927] hover:text-white shrink-0 transition-colors ml-2" aria-label="LinkedIn">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M13 5.828V9a1 1 0 1 1-2 0V5.828L8.414 8.414a1 1 0 1 1-1.414-1.414l4.293-4.293a1 1 0 0 1 1.414 0l4.293 4.293a1 1 0 1 1-1.414 1.414L13 5.828z"/><path d="M5 13a1 1 0 0 1 1 1v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 1 2 0v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/></svg>
                      </a>
                    </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
          </div>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="text-center">
            <Link href="/teams" className="standard-button bg-[#F54927] hover:bg-[#042970] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold inline-flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F54927]/50">
              View All Team Members
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-white" />
            </Link>
        </div>
        </section>

        {/* Enhanced Contact Section */}
        <Reveal variant="up" delay={900}>
          <section className="relative overflow-hidden rounded-xl sm:rounded-2xl standard-card p-0 group">
            <img 
              src="/images/hero/home.jpg" 
              alt="Contact background" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#042970]/80 via-[#042970]/70 to-[#F54927]/80 group-hover:from-[#042970]/90 group-hover:via-[#042970]/80 group-hover:to-[#F54927]/90 transition-all duration-500"></div>
            <div className="relative z-10 p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
                {/* Left Side - Content */}
                <div>
                  <div className="text-xs sm:text-sm uppercase tracking-[.25em] text-[#F54927] mb-3 sm:mb-4 font-bold">Get in touch</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
                    Your Partner For{' '}
                    <span className="text-[#F54927] relative inline-block">
                      Comprehensive Engineering Solutions
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-white animate-underline-expand"></span>
                    </span>
                  </h3>
                  <p className="text-white/90 mt-2 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
                    Tell us about your goals—our team will propose the safest, most cost‑effective path to deliver them.
                  </p>
                  
                  {/* Contact Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-[#F54927] transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F54927]/20 p-2 rounded-lg">
                          <HiOutlinePhone className="w-5 h-5 text-[#F54927]" />
                        </div>
                        <div>
                          <p className="text-white/70 text-xs">Phone</p>
                          <p className="text-white font-bold text-sm">+251 911 234 567</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-[#F54927] transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F54927]/20 p-2 rounded-lg">
                          <HiOutlineEnvelope className="w-5 h-5 text-[#F54927]" />
                        </div>
              <div>
                          <p className="text-white/70 text-xs">Email</p>
                          <p className="text-white font-bold text-sm">info@efengineering.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex flex-col gap-4 sm:gap-5">
                  <Link 
                    href="/contact" 
                    className="standard-button bg-[#F54927] hover:bg-white hover:text-[#F54927] text-white px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#F54927]/50"
                  >
                    <HiOutlinePhone className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:rotate-12 transition-transform" />
                    Call Us Now
                    <HiOutlineArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                  <Link 
                    href="/contact" 
                    className="standard-button bg-white/10 hover:bg-white hover:text-[#042970] text-white border-2 border-white/30 hover:border-white px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
                  >
                    <HiOutlineEnvelope className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:rotate-12 transition-transform" />
                    Send Message
                    <HiOutlineArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                  <Link 
                    href="/projects" 
                    className="standard-button bg-transparent hover:bg-[#042970] text-white border-2 border-white/50 hover:border-[#042970] px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base md:text-lg font-bold inline-flex items-center justify-center gap-3 group/btn transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <HiOutlinePlayCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:rotate-12 transition-transform" />
                    View Our Projects
                    <HiOutlineArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform" />
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
