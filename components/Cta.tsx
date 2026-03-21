import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import React from 'react'

export default function CTA() {
  return (
    <div className="border-b border-gray-100/50 bg-blue-950">
      <div className="mx-auto max-w-3xl p-12 xl:max-w-5xl">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to work together?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Let's discuss how we can help you achieve your goals.
          </p>
          <Link
            href="/contact"
            className="focus-ring rounded-xs bg-red-500 px-10 py-5 text-xl font-bold text-white transition duration-300 hover:bg-red-600"
          >
            Contact Us
          </Link>
        </div>

        {siteMetadata.newsletter?.provider && (
          <div className="flex items-center justify-center pt-12">
            <NewsletterForm />
          </div>
        )}
      </div>
    </div>
  )
}
