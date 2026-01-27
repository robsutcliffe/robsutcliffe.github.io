import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import YouTube from './YouTube'

export const components: any = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  YouTube,
}
