import { Suspense } from 'react'
import { JobApplicationQuery } from '../../../components/JobApplicationPage'

function ApplicationFallback() {
  return (
    <div className="min-h-screen bg-gray-50 engineering-bg flex items-center justify-center" role="status">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#F54927] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-semibold">Loading application form...</p>
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplicationFallback />}>
      <JobApplicationQuery />
    </Suspense>
  )
}
