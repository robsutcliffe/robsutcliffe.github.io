import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allServices, allCaseStudies } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  const sortedServices = sortPosts(allServices)
  const services = allCoreContent(sortedServices)

  const sortedCaseStudies = sortPosts(allCaseStudies)
  const caseStudies = allCoreContent(sortedCaseStudies)

  return <Main posts={posts} services={services} caseStudies={caseStudies} />
}
