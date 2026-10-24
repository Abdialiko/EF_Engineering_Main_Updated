'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageHeader from '../../../components/PageHeader'
import Reveal from '../../../components/Reveal'

const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })

export default function NewsDetail() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [news, setNews] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const [detailRes, listRes] = await Promise.all([
          fetch(`https://api.efengineering-architect.com/api/news/${id}`, { cache: 'no-store' }),
          fetch('https://api.efengineering-architect.com/api/news', { cache: 'no-store' }),
        ])
        if (!detailRes.ok) throw new Error(`News request failed (${detailRes.status})`)
        const detail = await detailRes.json()
        const list = listRes.ok ? await listRes.json() : []
        if (cancelled) return
        const item = detail?.data || detail
        const relatedItems = ((Array.isArray(list) ? list : list?.data) || [])
          .filter((item: any) => String(item.id) !== String(id))
          .slice(0, 3)
        setNews(item)
        setRelated(relatedItems)
        setMissing(false)
      } catch (error) {
        console.error('Failed to load news:', error)
        if (!cancelled) {
          setNews(null)
          setRelated([])
          setMissing(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="News Details" />
        <main className="container mx-auto px-4 py-12">
          <p className="text-gray-600">Loading news...</p>
        </main>
      </div>
    )
  }

  if (missing || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="News Details" />
        <main className="container mx-auto px-4 py-12">
          <p className="text-gray-600">This news article could not be loaded.</p>
          <a href="/news" className="inline-block mt-4 text-orange-600 font-semibold">Back to news</a>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="News Details" />
      <main className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-8">
          <Reveal variant="up" delay={0}>
            <div className="h-[280px] md:h-[420px] bg-gray-200 overflow-hidden">
              <img src={news?.photos?.[0]?.path || news?.image || '/assets/img/blog/blog-details-img1.jpg'} alt={news?.title} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-extrabold">{news?.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{news?.created_at ? fmt(news.created_at) : ''} · {news?.category || 'News'}</p>
            </div>
          </Reveal>
          <Reveal variant="up" delay={240}>
            <div className="bg-white border border-gray-200 mt-4 p-6 prose max-w-none prose-p:leading-7" dangerouslySetInnerHTML={{ __html: news?.description || 'No description available' }} />
          </Reveal>
        </article>

        <aside className="lg:col-span-4">
          {related.length > 0 && (
            <Reveal variant="left" delay={0}>
              <div className="bg-white border border-gray-200 p-5">
                <h3 className="text-sm uppercase tracking-[.2em] text-gray-500 mb-3">Related News</h3>
                <ul className="space-y-3">
                  {related.map((item: any, index: number) => (
                    <li key={item.id}>
                      <a href={`/news/${item.id}`} className="flex items-center gap-3 group">
                        <img src={item.photos?.[0]?.path || item.image || `/assets/img/blog/blog-v1-img${(index % 6) + 1}.jpg`} alt={item.title} className="w-14 h-14 object-cover" />
                        <div>
                          <p className="text-xs text-gray-500">{item.created_at ? fmt(item.created_at) : ''}</p>
                          <p className="font-semibold group-hover:text-orange-600">{item.title}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </aside>
      </main>
    </div>
  )
}
