import { allBlogs } from 'contentlayer/generated'

const DEFAULT_SLUGS = [
  'visualising-neural-network-stability',
  'visualising-potentially-redundant-capacity',
]

interface FurtherReadingPostsProps {
  slugs?: string[]
}

const FurtherReadingPosts = ({ slugs = DEFAULT_SLUGS }: FurtherReadingPostsProps) => {
  const posts = slugs.flatMap((slug) => {
    const post = allBlogs.find((p) => p.slug === slug)
    return post
      ? [
          {
            title: post.title,
            summary: post.summary ?? '',
            href: `/insights/${post.tags[0]}/${slug}`,
          },
        ]
      : []
  })

  return (
    <div className="not-prose mt-8">
      <h2 className="mb-4 text-xl font-bold text-blue-800">Further Reading</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            className="group block border border-blue-700 p-5 transition-all duration-300 hover:border-blue-800 hover:bg-yellow-200/30"
          >
            <div className="mb-2 font-semibold text-blue-800 transition-all group-hover:text-blue-800">
              {post.title}
            </div>
            <div className="line-clamp-2 text-sm leading-relaxed text-blue-800/70">
              {post.summary}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default FurtherReadingPosts
