import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allCaseStudies, allAuthors } from 'contentlayer/generated'
import type { CaseStudy, Authors } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import { notFound } from 'next/navigation'

export const generateStaticParams = async () =>
  allCaseStudies.map((p) => ({ slug: p.slug.split('/') }))

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allCaseStudies.find((p) => p.slug === slug) as CaseStudy

  if (!post) {
    return notFound()
  }

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const mainContent = coreContent(post)

  return (
    <PostSimple content={mainContent} authorDetails={authorDetails}>
      <MDXLayoutRenderer code={post.body.code} components={components} />
    </PostSimple>
  )
}
