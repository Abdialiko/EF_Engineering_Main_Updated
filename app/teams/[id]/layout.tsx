import { generateIdParams } from '../../../lib/staticParams'

export const dynamicParams = false

export function generateStaticParams() {
  return generateIdParams('teams')
}

export default function TeamIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
