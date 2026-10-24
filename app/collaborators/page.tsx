"use client"
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import { HiOutlineUserGroup, HiOutlineBuildingOffice2, HiOutlineHandRaised } from 'react-icons/hi2'
import { fetchApi } from '../../lib/api'

export default function Collaborators() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('clients')
        const collaboratorsData = Array.isArray(data) ? data : []
        // Filter for collaborators if needed, or use all clients
        setItems(collaboratorsData.filter((c: any) => (c.category || '').toLowerCase() === 'collaborator'))
      } catch (e) {
        console.error('Failed to load collaborators:', e)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 engineering-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      </div>

      <PageHeader title="Collaborators" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section */}
        <Reveal variant="up" delay={0}>
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">Our Network</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our{' '}
              <span className="text-[#042970] relative gradient-text inline-block">
                Collaborators
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h1>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed px-4">
              Our trusted network of partners and collaborators who work with us to deliver exceptional engineering and architectural solutions.
            </p>
          </div>
        </Reveal>

        {/* Collaborator Statistics */}
        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-12 sm:mb-16">
            <div className="standard-card interactive-card-3d p-5 sm:p-6 text-center bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-transparent hover:border-[#F54927] transition-all duration-500">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center mx-auto mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float">
                <HiOutlineUserGroup className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '32px', height: '32px', fontWeight: 'bold' }} />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{items.length}+</div>
              <p className="text-gray-600 text-sm sm:text-base font-semibold">Active Collaborators</p>
            </div>
            <div className="standard-card interactive-card-3d p-5 sm:p-6 text-center bg-gradient-to-br from-white via-[#042970]/5 to-white border-2 border-transparent hover:border-[#042970] transition-all duration-500">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#042970]/20 to-[#042970]/10 rounded-xl flex items-center justify-center mx-auto mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float">
                <HiOutlineBuildingOffice2 className="text-[#042970] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '32px', height: '32px', fontWeight: 'bold' }} />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">100+</div>
              <p className="text-gray-600 text-sm sm:text-base font-semibold">Joint Projects</p>
            </div>
            <div className="standard-card interactive-card-3d p-5 sm:p-6 text-center bg-gradient-to-br from-white via-[#F54927]/5 to-white border-2 border-transparent hover:border-[#F54927] transition-all duration-500">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F54927]/20 to-[#F54927]/10 rounded-xl flex items-center justify-center mx-auto mb-4 icon-container icon-bg-animate icon-entrance icon-micro-move icon-float continuous-float">
                <HiOutlineHandRaised className="text-[#F54927] icon-hover icon-glow icon-bounce icon-wiggle icon-scale-pulse icon-full-color" style={{ width: '32px', height: '32px', fontWeight: 'bold' }} />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">10+</div>
              <p className="text-gray-600 text-sm sm:text-base font-semibold">Years Partnership</p>
            </div>
          </div>
        </Reveal>

        {/* Collaborators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {loading ? (
            new Array(10).fill(0).map((_,i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl standard-card" />
            ))
          ) : items.length ? (
            items.map((it: any, i: number) => (
              <Reveal key={it.id || i} variant="up" delay={i * 50}>
                <div 
                  className="standard-card interactive-card-3d p-4 sm:p-5 md:p-6 flex items-center justify-center aspect-square bg-gradient-to-br from-white via-[#042970]/5 to-white border-2 border-transparent hover:border-[#042970] transition-all duration-500 group"
                  onMouseEnter={() => setHoveredItem(`collab-${it.id || i}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <img 
                    src={it.logo || it.image || it.photo || '/assets/img/brand/brand-v1-img1.png'} 
                    alt={it.name || 'Collaborator'} 
                    className={`max-h-12 sm:max-h-16 md:max-h-20 w-auto object-contain transition-all duration-500 ${
                      hoveredItem === `collab-${it.id || i}` ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    loading={i < 10 ? "eager" : "lazy"}
                  />
                </div>
              </Reveal>
            ))
          ) : (
            <Reveal variant="up">
              <div className="text-center py-12 sm:py-16 md:py-20 col-span-full">
                <HiOutlineUserGroup className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3">No Collaborators Found</h3>
                <p className="text-gray-600 text-sm sm:text-base">Check back later for our collaborator network.</p>
              </div>
            </Reveal>
          )}
        </div>
      </main>
    </div>
  )
}
