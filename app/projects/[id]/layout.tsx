import { generateIdParams } from '../../../lib/staticParams'

export const dynamicParams = false

export function generateStaticParams() {
  return generateIdParams('projects')
}

export default function ProjectIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
