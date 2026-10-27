import { compile } from '@mdx-js/mdx'
import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'
import readingTime from 'reading-time'
import GithubSlugger from 'github-slugger'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkExtractFrontmatter, remarkCodeTitles, remarkImgToJsx, extractTocHeadings } from 'pliny/mdx-plugins/index.js'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import matter from 'gray-matter'

const PROJECT_ROOT = '/Users/robsutcliffe/apps/robsutcliffe.github.io'
const MDX_FILE = `${PROJECT_ROOT}/data/blog/visualising-an-embedding-space.mdx`
const OUT_FILE = `${PROJECT_ROOT}/.contentlayer/generated/Blog/blog__visualising-an-embedding-space.mdx.json`

const raw = readFileSync(MDX_FILE, 'utf-8')
const { data: frontmatter, content: mdxContent } = matter(raw)

console.log('Frontmatter:', frontmatter)

// Compile MDX to ESM JS
const compiled = await compile(mdxContent, {
  outputFormat: 'function-body',
  remarkPlugins: [
    remarkExtractFrontmatter,
    remarkGfm,
    remarkCodeTitles,
    remarkMath,
    remarkImgToJsx,
  ],
  rehypePlugins: [
    rehypeSlug,
    rehypeAutolinkHeadings,
    rehypeKatex,
    [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
  ],
})

const compiledStr = String(compiled)

// Bundle with esbuild into IIFE
const result = await build({
  stdin: {
    contents: compiledStr,
    loader: 'jsx',
  },
  bundle: false,
  format: 'iife',
  globalName: 'Component',
  minify: true,
  write: false,
})

const bundledCode = new TextDecoder().decode(result.outputFiles[0].contents)

// Compute reading time
const rt = readingTime(mdxContent)

// Extract TOC from headings
const slugger = new GithubSlugger()
const headingRegex = /^(#{1,6})\s+(.+)$/gm
const toc = []
let match
while ((match = headingRegex.exec(mdxContent)) !== null) {
  const depth = match[1].length
  const value = match[2].trim()
  const url = '#' + slugger.slug(value)
  toc.push({ value, url, depth })
}

const slug = 'visualising-an-embedding-space'
const filePath = `blog/${slug}.mdx`

const doc = {
  title: frontmatter.title,
  date: new Date(frontmatter.date).toISOString(),
  tags: frontmatter.tags || [],
  draft: frontmatter.draft ?? false,
  summary: frontmatter.summary || '',
  body: {
    raw: mdxContent,
    code: bundledCode,
  },
  _id: filePath,
  _raw: {
    sourceFilePath: filePath,
    sourceFileName: `${slug}.mdx`,
    sourceFileDir: 'blog',
    contentType: 'mdx',
    flattenedPath: `blog/${slug}`,
  },
  type: 'Blog',
  readingTime: {
    text: rt.text,
    minutes: rt.minutes,
    time: rt.time,
    words: rt.words,
  },
  slug,
  path: `blog/${slug}`,
  filePath,
  toc,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    datePublished: new Date(frontmatter.date).toISOString(),
    dateModified: new Date(frontmatter.date).toISOString(),
    description: frontmatter.summary || '',
    image: 'https://robsutcliffe.github.io/static/images/twitter-card.png',
    url: `https://robsutcliffe.github.io/blog/${slug}`,
  },
}

writeFileSync(OUT_FILE, JSON.stringify(doc, null, 2))
console.log('Written:', OUT_FILE)
console.log('Code length:', bundledCode.length)
