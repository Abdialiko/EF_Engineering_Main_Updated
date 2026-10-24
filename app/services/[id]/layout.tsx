import { generateIdParams } from '../../../lib/staticParams'

export const dynamicParams = false

export function generateStaticParams() {
  return generateIdParams('services')
}

export default function ServiceIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
