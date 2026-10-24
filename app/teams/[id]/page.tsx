'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageHeader from '../../../components/PageHeader'
import Reveal from '../../../components/Reveal'

export default function TeamDetail() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [team, setTeam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.efengineering-architect.com/api/teams/${id}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Team request failed (${response.status})`)
        const payload = await response.json()
        if (cancelled) return
        setTeam(payload?.data || payload)
        setMissing(false)
      } catch (error) {
        console.error('Failed to load team member:', error)
        if (!cancelled) {
          setTeam(null)
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

  const photo = team?.photo || team?.image || team?.image_url || '/assets/img/team/team-v2-img1.jpg'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Team Member" />
        <main className="container mx-auto px-4 py-12">
          <p className="text-gray-600">Loading profile...</p>
        </main>
      </div>
    )
  }

  if (missing || !team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Team Member" />
        <main className="container mx-auto px-4 py-12">
          <p className="text-gray-600">This team profile could not be loaded.</p>
          <a href="/teams" className="inline-block mt-4 text-orange-600 font-semibold">Back to team</a>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={team?.name || 'Team Member'} />
      <main className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Reveal variant="left" delay={0}>
            <div className="bg-white border border-gray-200 p-4">
              <img src={photo} alt={team?.name} className="w-full h-auto object-cover" />
              <h1 className="text-2xl font-extrabold mt-4">{team?.name}</h1>
              <p className="text-gray-600">{team?.role || team?.position}</p>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <Reveal variant="up" delay={120}>
            <div className="bg-white border border-gray-200 p-6 md:p-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: team?.bio || team?.description || '<p>Profile details coming soon.</p>' }} />
          </Reveal>
        </div>
      </main>
    </div>
  )
}
