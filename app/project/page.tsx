'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProjectRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/projects')
  }, [router])

  return (
    <p className="container mx-auto px-4 py-16 text-center text-gray-700">
      Opening the projects page. <a className="text-orange-600 font-semibold" href="/projects">Continue</a>
    </p>
  )
}
