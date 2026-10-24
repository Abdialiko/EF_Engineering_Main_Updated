'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PartnerRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/partners')
  }, [router])

  return (
    <p className="container mx-auto px-4 py-16 text-center text-gray-700">
      Opening the partners page. <a className="text-orange-600 font-semibold" href="/partners">Continue</a>
    </p>
  )
}
