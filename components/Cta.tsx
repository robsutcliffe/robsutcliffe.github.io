import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import React from 'react'

export default function CTA() {
  return (
    <div className="border-b border-blue-100/50 bg-blue-800">
      <div className="mx-auto max-w-3xl p-8 xl:max-w-5xl">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl sm:leading-12">
            Ready to work together?
          </h2>
          <p className="mt-4 mb-8 text-base leading-6 text-yellow-200 sm:mt-0 sm:text-lg sm:leading-8">
            Let's discuss how we can help you achieve your goals.
          </p>
          <Link
            href="/contact"
            className="focus-ring flex h-12 items-center rounded-sm bg-white px-10 text-sm font-bold text-blue-800 uppercase transition duration-300 hover:bg-blue-50 sm:h-16"
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
