'use client'
import { useParams } from 'next/navigation'
import JobApplicationPage from '../../../components/JobApplicationPage'

export default function VacancyApplication() {
  const params = useParams()
  const raw = params?.id
  const jobKey = Array.isArray(raw) ? raw[0] : raw || ''
  return <JobApplicationPage jobKey={String(jobKey)} />
}
