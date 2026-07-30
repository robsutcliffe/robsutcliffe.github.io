'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import projectsData from '@/data/projectsData'

// Map of embeddable project components, keyed by slug
const embedRegistry: Record<string, React.ComponentType> = {
  'layer-health-inspector': dynamic(
    () =>
      import('../app/(main)/projects/layer-health-inspector/components/LayerHealthInspectorEmbed'),
    { ssr: false }
  ),
}

interface ProjectProps {
  name: string
}

const Project = ({ name }: ProjectProps) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const project = projectsData.find((p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug)

  const EmbedComponent = embedRegistry[slug]

  if (!project) {
    return (
      <div className="my-8 rounded-sm border border-blue-700/30 bg-blue-50 px-6 py-4 text-blue-800">
        <p className="text-sm">Project not found: {name}</p>
      </div>
    )
  }

  if (EmbedComponent) {
    return (
      <div className="not-prose -mx-4 my-8 overflow-hidden md:mx-0 lg:-mr-20 xl:-mr-60">
        <EmbedComponent />
      </div>
    )
  }

  // Fallback: linked card for projects without an embed component
  return (
    <div className="not-prose my-8">
      <a
        href={project.href}
        className="group block overflow-hidden rounded-sm border border-blue-700/30 bg-white shadow-sm transition duration-300 hover:border-blue-700 hover:shadow-md"
        aria-label={`Link to project: ${project.title}`}
      >
        <div className="flex items-center gap-4 p-4 sm:p-6">
          {project.imgSrc && (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xs border border-blue-700/20">
              <img
                src={project.imgSrc}
                alt={project.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-xs bg-blue-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-blue-700 uppercase">
                Project
              </span>
            </div>
            <h3 className="text-base font-bold text-blue-900 transition duration-300 group-hover:text-blue-700 sm:text-lg">
              {project.title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-blue-800/70">{project.description}</p>
          </div>
          <div className="hidden shrink-0 text-blue-500 transition duration-300 group-hover:text-blue-700 sm:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Project
