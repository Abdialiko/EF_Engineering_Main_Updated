"use client"
import PageHeader from '../../components/PageHeader'
import Reveal from '../../components/Reveal'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchApi } from '../../lib/api'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })

export default function News() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchApi('news')
        setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Failed to load news:', e)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Latest News" />
      <main className="responsive-container py-10 sm:py-12">
        <Reveal variant="up" delay={0}>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">Latest News</h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">Stay updated with the latest news and events from EF Engineering.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {loading ? (
            new Array(6).fill(0).map((_,i)=>(<div key={i} className="h-[400px] sm:h-[420px] bg-white border border-gray-200 animate-pulse rounded-lg standard-card" />))
          ) : items.length ? (
            items.map((n: any, i: number) => (
              <Reveal key={n.id} variant="up" delay={i * 80}>
                <Link href={`/news/${n.id}`} className="standard-card interactive-card-3d p-0 flex flex-col overflow-hidden group h-full">
                  <div className="h-48 sm:h-52 md:h-56 bg-gray-200 overflow-hidden">
                    <img 
                      src={n.photos?.[0]?.path || n.image || `/assets/img/blog/blog-v1-img${(i%6)+1}.jpg`} 
                      alt={n.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
                      loading={i < 6 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-grow">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="px-2 py-1 bg-[#F54927]/10 text-[#F54927] rounded-full font-semibold">{n.category || 'News'}</span>
                      <span>{n.created_at ? fmt(n.created_at) : ''}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug group-hover:text-[#F54927] transition-colors">{n.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed flex-grow">{(n.short_desc || (n.description||'').replace(/<[^>]*>/g,'')).slice(0,120)}...</p>
                    <span className="mt-2 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F54927] group-hover:gap-3 transition-all">
                      READ MORE
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))
          ) : (
            <Reveal variant="up">
              <div className="text-gray-600 text-center py-12 col-span-full text-sm sm:text-base">No news available.</div>
            </Reveal>
          )}
        </div>
      </main>
    </div>
  )
}