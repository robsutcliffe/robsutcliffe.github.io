'use client'

import React, { useState } from 'react'
import SectionContainer from '@/components/SectionContainer'
import AnimatedBackground from '@/components/AnimatedBackground'
import PageTitle from '@/components/PageTitle'
import Calendly from '@/components/Calendly'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(form)

      const response = await fetch('https://formspree.io/f/xojjvowq', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setSubmitted(true)
        form.reset()
      } else {
        setError('Something went wrong. Please try again.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Failed to submit form. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SectionContainer>
        <div className="w-full pb-3 text-lg text-blue-800">
          <PageTitle>Contact Us</PageTitle>
          <p>
            <i className="font-bold">
              Tell me where your store is stuck—conversion, speed, UX, or data
            </i>
            —and I’ll reply with one high‑impact next step and whether a short project together
            makes sense.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl flex-col gap-6 py-3 md:max-w-4xl xl:max-w-5xl"
        >
          {submitted && (
            <div className="-mb-2 flex items-center justify-center border border-green-600 bg-green-50 p-6">
              <p className="text-lg font-semibold text-green-600">
                Message sent successfully. We will be in contact shortly.
              </p>
            </div>
          )}

          {error && (
            <div className="-mb-2 flex items-center justify-center border border-red-600 bg-red-50 p-6">
              <p className="text-lg font-semibold text-red-600">{error}</p>
            </div>
          )}

          <>
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:gap-8">
              <div className="flex flex-1 flex-col gap-3">
                {/* Full Name */}
                <fieldset className="group flex flex-col gap-0">
                  <label className="z-10 -mb-4 ml-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-sm tracking-wide text-blue-800 group-focus-within:text-blue-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    disabled={isSubmitting}
                    className="w-full border border-blue-800 bg-transparent p-4 px-6 text-xl text-blue-800 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                  />
                </fieldset>

                {/* Email */}
                <fieldset className="group flex flex-col gap-0">
                  <label className="z-10 -mb-4 ml-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-sm tracking-wide text-blue-800 group-focus-within:text-blue-500">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full border border-blue-800 bg-transparent p-4 px-6 text-xl text-blue-800 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                  />
                </fieldset>

                {/* Phone Number */}
                <fieldset className="group flex flex-col gap-0">
                  <label className="z-10 -mb-4 ml-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-sm tracking-wide text-blue-800 group-focus-within:text-blue-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    disabled={isSubmitting}
                    className="w-full border border-blue-800 bg-transparent p-4 px-6 text-xl text-blue-800 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                  />
                </fieldset>

                {/* Budget */}
                <fieldset className="group flex flex-col gap-0">
                  <label className="z-10 -mb-4 ml-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-sm tracking-wide text-blue-800 group-focus-within:text-blue-500">
                    Budget
                  </label>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-4 border border-blue-800 bg-transparent p-5 px-6 focus-within:border-blue-500">
                    {['£2k-£5k', '£5k-£10k', '£10k-£20k', '£20k+'].map((range) => (
                      <label
                        key={range}
                        className="flex cursor-pointer items-center gap-2 text-sm text-blue-800"
                      >
                        <div className="relative flex h-5 w-5 items-center justify-center">
                          <input
                            type="radio"
                            name="budget"
                            value={range}
                            disabled={isSubmitting}
                            className="peer h-4 w-4 cursor-pointer appearance-none border border-blue-800 bg-transparent checked:border-blue-500 focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
                          />
                          <div className="pointer-events-none absolute h-2.5 w-2.5 scale-0 rounded-full bg-blue-500 transition-transform peer-checked:scale-100" />
                        </div>
                        {range}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Right Column - Message */}
              <div className="flex flex-1 flex-col">
                <fieldset className="group flex h-full flex-col gap-0">
                  <label className="z-10 -mb-4 ml-4 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-sm tracking-wide text-blue-800 group-focus-within:text-blue-500">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    disabled={isSubmitting}
                    className="min-h-40 w-full flex-1 resize-none border border-blue-800 bg-transparent p-4 px-6 text-base text-blue-800 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50"
                  />
                </fieldset>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring relative mt-2 cursor-pointer overflow-hidden bg-red-500 p-6 font-bold text-white transition-opacity disabled:opacity-60"
              onMouseEnter={() => !isSubmitting && setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatedBackground isHovered={isHovered} opacity="0.3" stroke="#061E2A" />
              <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </>
        </form>
      </SectionContainer>
      <Calendly />
    </>
  )
}
