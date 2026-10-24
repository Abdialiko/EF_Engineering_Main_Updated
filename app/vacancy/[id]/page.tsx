'use client'
import { useParams } from 'next/navigation'
import JobDetailsView from '../../../components/JobDetailsView'

export default function JobDetailsPage() {
  const params = useParams()
  const raw = params?.id
  const jobKey = Array.isArray(raw) ? raw[0] : raw || ''
  return <JobDetailsView jobKey={String(jobKey)} />
}
