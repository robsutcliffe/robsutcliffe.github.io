'use client'

import { useEffect } from 'react'
import Plausible from '@plausible-analytics/tracker'

export default function PlausibleAnalytics() {
  useEffect(() => {
    const plausible = Plausible({
      domain: 'robsutcliffe.github.io',
      apiHost: 'https://plausible.io',
      // Enable ideal options for tracking
      trackLocalhost: false,
    })

    // Enable automatic pageview tracking
    plausible.enableAutoPageviews()

    // Enable outbound link tracking
    plausible.enableAutoOutboundClickTracking()

    // Expose plausible globally if needed for custom goals/events
    // @ts-ignore
    window.plausible = plausible.trackEvent
  }, [])

  return null
}
