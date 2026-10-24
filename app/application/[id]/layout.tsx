import { generateIdParams } from '../../../lib/staticParams'

export const dynamicParams = false

export function generateStaticParams() {
  return generateIdParams('jobs', { emptyFallbackId: '1' })
}

export default function ApplicationIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
