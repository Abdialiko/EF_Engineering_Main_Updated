import { Suspense } from 'react'
import { JobDetailsLoading, JobDetailsQuery } from '../../../components/JobDetailsView'

export default function VacancyDetailsPage() {
  return (
    <Suspense fallback={<JobDetailsLoading />}>
      <JobDetailsQuery />
    </Suspense>
  )
}
