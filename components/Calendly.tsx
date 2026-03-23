'use client'

import React, { useEffect, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Calendly: any
  }
}

export default function Calendly() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // If Calendly is already loaded, we need to initialize the widget manually
    // on component mount for SPA navigation to work.
    const initWidget = () => {
      if (
        window.Calendly &&
        typeof window.Calendly.initInlineWidget === 'function' &&
        containerRef.current
      ) {
        if (containerRef.current.innerHTML === '') {
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/rob-sutcliffe/30-mins',
            parentElement: containerRef.current,
          })
        }
      }
    }

    initWidget()
  }, [])

  return (
    <div className="border-b border-blue-100/50 bg-blue-800">
      <div className="mx-auto max-w-5xl p-12 pb-0 lg:max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Book a 30 minute strategy call
          </h2>
          <p className="text-lg text-yellow-200">
            Let's discuss how we can help you achieve your goals.
          </p>
          <div
            ref={containerRef}
            className="calendly-inline-widget h-[700px] w-full min-w-[320px]"
            data-url="https://calendly.com/rob-sutcliffe/30-mins"
          />
          <Script
            type="text/javascript"
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="afterInteractive"
            onLoad={() => {
              if (
                window.Calendly &&
                typeof window.Calendly.initInlineWidget === 'function' &&
                containerRef.current
              ) {
                if (containerRef.current.innerHTML === '') {
                  window.Calendly.initInlineWidget({
                    url: 'https://calendly.com/rob-sutcliffe/30-mins',
                    parentElement: containerRef.current,
                  })
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
