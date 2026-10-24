"use client"
import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import { HiOutlinePhoto, HiOutlineBuildingOffice2, HiOutlineAcademicCap, HiOutlineTrophy, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineMapPin, HiOutlineCheckBadge, HiOutlineXMark, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'
import { fetchApi } from '../../lib/api'
import Image from 'next/image'

function cleanText(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || /^null$/i.test(trimmed) || /^undefined$/i.test(trimmed)) return ''
  return trimmed
}

function resolveGalleryImage(g: any): string {
  if (!g) return '/images/hero/home.jpg'

  const candidates: unknown[] = [g.path, g.image_url, g.image, g.photo]
  if (Array.isArray(g.photos) && g.photos.length) {
    const first = g.photos[0]
    candidates.push(typeof first === 'string' ? first : (first?.path || first?.url || first?.src))
  }

  for (const raw of candidates) {
    if (typeof raw !== 'string') continue
    const value = raw.trim()
    if (!value || /^null$/i.test(value) || /^undefined$/i.test(value)) continue
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('blob:')) {
      return value
    }
    if (value.startsWith('/')) return `https://api.efengineering-architect.com${value}`
    return `https://api.efengineering-architect.com/${value}`
  }

  return '/images/hero/home.jpg'
}

function GalleryThumb({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-500 px-4 text-center">
        <HiOutlinePhoto className="w-10 h-10" />
        <span className="text-xs font-semibold">Image unavailable</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-cover transition-transform duration-500 group-hover:scale-110"
      loading={eager ? 'eager' : 'lazy'}
      quality={85}
      onError={() => setFailed(true)}
    />
  )
}

function GalleryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: any[]
  index: number
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
}) {
  const item = items[index]
  const src = resolveGalleryImage(item)
  const title = cleanText(item?.title || item?.name)
  const description = cleanText(item?.description)
  const [loadedSrc, setLoadedSrc] = useState('')
  const [failedSrc, setFailedSrc] = useState('')
  const imageRef = useRef<HTMLImageElement | null>(null)
  const loaded = loadedSrc === src
  const failed = failedSrc === src
  const canNavigate = items.length > 1

  const markImage = useCallback((node: HTMLImageElement | null) => {
    if (!node) return
    if (node.naturalWidth > 0) setLoadedSrc(src)
    else if (node.complete) setFailedSrc(src)
  }, [src])

  useEffect(() => {
    const node = imageRef.current
    if (!node) return

    const onLoad = () => setLoadedSrc(src)
    const onError = () => setFailedSrc(src)
    markImage(node)
    node.addEventListener('load', onLoad)
    node.addEventListener('error', onError)
    return () => {
      node.removeEventListener('load', onLoad)
      node.removeEventListener('error', onError)
    }
  }, [index, markImage, src])

  useEffect(() => {
    if (!canNavigate) return
    const preload = (nextIndex: number) => {
      const url = resolveGalleryImage(items[nextIndex])
      if (!url) return
      const image = new window.Image()
      image.src = url
    }
    preload((index + 1) % items.length)
    preload((index - 1 + items.length) % items.length)
  }, [canNavigate, index, items])

  useEffect(() => {
    document.getElementById('gallery-lightbox-close')?.focus()
  }, [])

  if (typeof document === 'undefined' || !item) return null

  return createPortal(
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Gallery image preview'}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#070d18] transition-opacity duration-300"
        aria-label="Close preview"
        onClick={onClose}
      />

      <div className="pointer-events-none relative z-10 grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-3 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="pointer-events-auto rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
            {index + 1} / {items.length}
          </div>
          <button
            id="gallery-lightbox-close"
            type="button"
            onClick={onClose}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F54927] text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-[#d93d1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-12 sm:w-12"
            aria-label="Close"
          >
            <HiOutlineXMark className="h-6 w-6" />
          </button>
        </div>

        <div className="relative h-full min-h-0">
          {canNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                className="pointer-events-auto absolute left-0 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#042970] shadow-lg transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-12 sm:w-12"
                aria-label="Previous image"
              >
                <HiOutlineChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                className="pointer-events-auto absolute right-0 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#042970] shadow-lg transition duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-12 sm:w-12"
                aria-label="Next image"
              >
                <HiOutlineChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="gallery-lightbox-frame">
            {!loaded && !failed && (
              <div className="absolute inset-0 z-10 flex items-center justify-center" role="status" aria-live="polite">
                <div className="h-12 w-12 rounded-full border-4 border-white/25 border-t-white animate-spin" />
                <span className="sr-only">Loading image</span>
              </div>
            )}

            {failed ? (
              <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
                <div className="mx-4 max-w-sm rounded-2xl bg-white/10 px-6 py-8 text-center text-white shadow-2xl">
                  <HiOutlinePhoto className="mx-auto mb-3 h-12 w-12 text-white/80" />
                  <p className="text-base font-semibold">This image could not be loaded</p>
                  <p className="mt-1 text-sm text-white/70">Use the arrows to view another photo, or close the preview.</p>
                </div>
              </div>
            ) : (
              // The frame has a fixed size, so object-contain scales the whole photo inside it.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={title || 'Gallery image'}
                className="gallery-lightbox-image"
                draggable={false}
                ref={imageRef}
                onLoad={() => setLoadedSrc(src)}
                onError={() => setFailedSrc(src)}
              />
            )}
          </div>
        </div>

        <div className="flex min-h-12 items-center justify-center px-2">
          {(title || description) && (
            <div className="pointer-events-auto max-w-3xl rounded-2xl bg-black/60 px-4 py-2.5 text-center text-white backdrop-blur-sm">
              {title && <h3 className="text-sm font-bold sm:text-base">{title}</h3>}
              {description && <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:text-sm">{description}</p>}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function GalleryContent() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [loading, setLoading] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('galleries')
        const list = Array.isArray(data) ? data : (data?.data || [])
        setItems(list)
        
        // Check for category query parameter
        const categoryParam = searchParams?.get('category')
        if (categoryParam) {
          const category = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
          setActiveCategory(category)
          setFiltered(list.filter((g: any) => (g.category || '').toLowerCase() === category.toLowerCase()))
        } else {
          setFiltered(list)
        }
      } catch (e) {
        console.error('Failed to load galleries:', e)
        setItems([])
        setFiltered([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchParams])

  const categories = [
    { name: 'All', icon: HiOutlinePhoto },
    { name: 'Project', icon: HiOutlineBuildingOffice2 },
    { name: 'Designed', icon: HiOutlineAcademicCap },
    { name: 'Ceremony', icon: HiOutlineTrophy },
    { name: 'Certificate', icon: HiOutlineDocumentText }
  ]

  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.name.toLowerCase() === cat.toLowerCase())
    return found?.icon || HiOutlinePhoto
  }

  const onFilter = (cat: string) => {
    setActiveCategory(cat)
    if (cat === 'All') {
      setFiltered(items)
    } else {
      setFiltered(items.filter((g: any) => (g.category || '').toLowerCase() === cat.toLowerCase()))
    }
  }

  const openFullSize = (index: number) => {
    setSelectedImage(index)
  }

  const closeFullSize = useCallback(() => {
    setSelectedImage(null)
  }, [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedImage((current) => {
      if (current === null || filtered.length === 0) return current
      if (direction === 'next') {
        return current < filtered.length - 1 ? current + 1 : 0
      }
      return current > 0 ? current - 1 : filtered.length - 1
    })
  }, [filtered.length])

  useEffect(() => {
    if (selectedImage === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeFullSize()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateImage('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, closeFullSize, navigateImage])

  // Prevent body scroll when full-size is open
  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#F54927]/10 rounded-full animate-float shape-float-x hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-[#042970]/10 rounded-lg rotate-45 animate-float-reverse shape-float-x hidden lg:block" style={{ animationDelay: '1s' }}></div>
      </div>

      <PageHeader title="Project Gallery" />
      <main className="responsive-container py-10 sm:py-12 md:py-16 relative z-10">
        {/* Hero Section */}
        <Reveal variant="up" delay={0}>
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <p className="text-[#F54927] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3 sm:mb-4">Our Portfolio</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Project{' '}
              <span className="text-[#042970] relative gradient-text inline-block">
                Gallery
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#F54927] animate-underline-expand"></span>
              </span>
            </h1>
            <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed px-4">
              Browse through our collection of completed projects, ceremonies, and achievements showcasing our expertise and commitment to excellence.
            </p>
          </div>
        </Reveal>

        {/* Enhanced Filters */}
        <Reveal variant="up" delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            {categories.map((c) => {
              const Icon = c.icon
              const isActive = activeCategory === c.name
              return (
                <button 
                  key={c.name} 
                  onClick={() => onFilter(c.name)}
                  onMouseEnter={() => setHoveredItem(`filter-${c.name}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 text-sm sm:text-base font-bold transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? 'bg-[#F54927] border-[#F54927] text-white shadow-lg shadow-[#F54927]/50 scale-105'
                      : hoveredItem === `filter-${c.name}`
                      ? 'bg-[#F54927]/10 border-[#F54927] text-[#F54927]'
                      : 'bg-white border-gray-300 text-gray-800 hover:border-[#F54927] hover:text-[#F54927]'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`} style={{ fontWeight: 'bold' }} />
                  <span>{c.name === 'Designed' ? 'Designed Projects' : c.name === 'Ceremony' ? 'Ceremonies' : c.name}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Clean Grid with Features */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {new Array(12).fill(0).map((_,i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filtered.map((g: any, i: number) => {
              const imageUrl = resolveGalleryImage(g)
              const title = cleanText(g.title || g.name) || 'Gallery Item'
              const description = cleanText(g.description)
              const CategoryIcon = getCategoryIcon(g.category || 'All')
              const hasValidDate = g.date && !Number.isNaN(new Date(g.date).getTime())
              return (
                <Reveal key={g.id || i} variant="up" delay={i * 50}>
                  <div 
                    className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                    onMouseEnter={() => setHoveredItem(`gallery-${g.id || i}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Clean Image - No Borders - Clickable */}
                    <div 
                      className="relative w-full aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => openFullSize(i)}
                    >
                    <GalleryThumb
                      src={imageUrl}
                      alt={title}
                      eager={i < 8}
                    />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-[#F54927] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                          <CategoryIcon className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase">
                            {g.category || 'Gallery'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Features Section */}
                    <div className="p-4 sm:p-5">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#F54927] transition-colors">
                        {title}
                      </h3>
                      
                      {/* Description */}
                      {description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {description}
                        </p>
                      )}
                      
                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                        {g.category && (
                          <div className="flex items-center gap-2">
                            <HiOutlineBuildingOffice2 className="w-4 h-4 text-[#F54927] flex-shrink-0" />
                            <span className="text-xs text-gray-600 truncate">{g.category}</span>
                          </div>
                        )}
                        {hasValidDate && (
                          <div className="flex items-center gap-2">
                            <HiOutlineCalendar className="w-4 h-4 text-[#042970] flex-shrink-0" />
                            <span className="text-xs text-gray-600 truncate">
                              {new Date(g.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                        {g.location && (
                          <div className="flex items-center gap-2 col-span-2">
                            <HiOutlineMapPin className="w-4 h-4 text-[#F54927] flex-shrink-0" />
                            <span className="text-xs text-gray-600 truncate">{g.location}</span>
                          </div>
                        )}
                        {g.status && (
                          <div className="flex items-center gap-2 col-span-2">
                            <HiOutlineCheckBadge className={`w-4 h-4 flex-shrink-0 ${
                              g.status === 'completed' ? 'text-[#10B981]' : 'text-[#042970]'
                            }`} />
                            <span className={`text-xs font-semibold ${
                              g.status === 'completed' ? 'text-[#10B981]' : 'text-[#042970]'
                            }`}>
                              {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                            </span>
                        </div>
                        )}
                    </div>
                  </div>
                </div>
              </Reveal>
              )
            })}
          </div>
        ) : (
          <Reveal variant="up">
            <div className="text-center py-12 sm:py-16 md:py-20">
              <HiOutlinePhoto className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3">No Gallery Items Found</h3>
              <p className="text-gray-600 text-sm sm:text-base">Try selecting a different category to see more items.</p>
            </div>
          </Reveal>
        )}

        {selectedImage !== null && filtered[selectedImage] && (
          <GalleryLightbox
            items={filtered}
            index={selectedImage}
            onClose={closeFullSize}
            onNavigate={navigateImage}
          />
        )}
      </main>
    </div>
  )
}

export default function Gallery() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F54927] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}
