'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/clients')
  }, [router])

  return (
    <p className="container mx-auto px-4 py-16 text-center text-gray-700">
      Opening the clients page. <a className="text-orange-600 font-semibold" href="/clients">Continue</a>
    </p>
  )
}
