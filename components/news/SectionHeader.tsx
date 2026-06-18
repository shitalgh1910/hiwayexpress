import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  href?: string
  color?: string
}

export default function SectionHeader({ title, href, color = 'red' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-6 bg-${color}-700 rounded-full`} />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-sm text-red-700 hover:underline font-medium">
          सबै हेर्नुहोस् »
        </Link>
      )}
    </div>
  )
}
