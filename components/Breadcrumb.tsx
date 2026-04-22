'use client'

import Dropdown from '@/components/Dropdown'
import tagData from '../app/tag-data.json'
import { usePathname } from 'next/navigation'
import GithubSlugger from 'github-slugger'

const slugger = new GithubSlugger()

const pagesRaw = [
  {
    text: 'Insights',
    href: '/insights',
  },
  {
    text: 'Case Studies',
    href: '/case-studies',
  },
  {
    text: 'Services',
    href: '/services',
  },
  {
    text: 'Contact',
    href: '/contact',
  },
]

export default function Breadcrumb() {
  slugger.reset()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const pathname = usePathname()
  const pathParts = pathname.split('/')

  const fullTagCount = Object.values(tagCounts).reduce((acc, val) => acc + val, 0)

  const isInsights = pathname.startsWith('/insights')

  const options = [
    {
      text: 'All Posts',
      count: fullTagCount,
      href: '/insights',
      selected: pathname === '/insights',
    },
    ...sortedTags.map((t) => {
      const s = slugger.slug(t)
      return {
        text: t,
        count: tagCounts[t],
        href: `/insights/${s}`,
        selected: pathParts[2] === s,
      }
    }),
  ]

  const pages = pagesRaw.map((p) => ({ ...p, selected: pathname.startsWith(p.href) }))

  return (
    <div className="z-10 mt-6 mr-24 ml-36 flex flex-row gap-6">
      <div className="flex-1">
        <Dropdown options={pages} />
      </div>
      {isInsights && (
        <div className="flex-1">
          <Dropdown options={options} />
        </div>
      )}
    </div>
  )
}
