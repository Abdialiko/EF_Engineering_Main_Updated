import { generateIdParams } from '../../../lib/staticParams'

export const dynamicParams = false

export function generateStaticParams() {
  return generateIdParams('news')
}

export default function NewsIdLayout({ children }: { children: React.ReactNode }) {
  return children
}
