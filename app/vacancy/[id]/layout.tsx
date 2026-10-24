import { generateIdParams } from '../../../lib/staticParams'

export const dynamicParams = false

export function generateStaticParams() {
  // The jobs list is allowed to be empty. Next.js still requires at least one
  // exported path, so the existing client page is emitted for id "1" and loads
  // the live job record itself.
  return generateIdParams('jobs', { emptyFallbackId: '1' })
}

export default function VacancyIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
