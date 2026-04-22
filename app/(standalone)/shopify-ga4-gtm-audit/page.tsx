import React from 'react'
import Checklist from '@/components/Checklist'
import Button from '@/components/Button'
import SectionContainer from '@/components/SectionContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopify GA4 & GTM Audit',
  description:
    'Fix broken Shopify tracking, validate your ecommerce events, and make your reporting trustworthy again.',
}

export default function ShopifyAuditPage() {
  return (
    <SectionContainer>
      <div className="-m-30 mx-auto max-w-4xl">
        <header className="mb-16">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-blue-800 sm:text-5xl lg:text-6xl">
            Shopify GA4 & GTM Audit
          </h1>
          <p className="mb-8 text-2xl font-bold text-red-500">
            Fix broken tracking before it costs you more money
          </p>
          <p className="text-xl leading-relaxed text-blue-700">
            If your GA4 revenue doesn’t match Shopify, your key events are unreliable, or your team
            keeps debating which numbers to trust, this audit fixes the tracking issues underneath
            the problem.
          </p>
          <p className="mt-6 text-xl leading-relaxed text-blue-700">
            You’ll get a full review of your Shopify GA4 and GTM setup, validation of your key
            ecommerce events, a prioritized list of issues, and implementation of the most important
            fixes so your reports become usable again.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-800">This is for you if</h2>
          <Checklist
            items={[
              'Your GA4 revenue or orders don’t line up with Shopify.',
              'Add to cart, begin checkout, or purchase events look incomplete or duplicated.',
              'You’re running paid traffic but don’t trust the numbers enough to scale with confidence.',
              'You want a dashboard later, but your tracking needs fixing first.',
            ]}
          />
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-800">What I audit</h2>
          <Checklist
            items={[
              'GA4 property and stream setup, including conversions and ecommerce configuration.',
              'GTM container setup, including tags, triggers, variables, and duplicate firing risks.',
              'Shopify ecommerce event tracking across product view, add to cart, checkout, and purchase.',
              'Key parameters like value, currency, transaction IDs, and item-level data.',
              'Revenue and order discrepancies between GA4 and Shopify.',
            ]}
          />
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-800">What’s included</h2>
          <Checklist
            items={[
              '1 kickoff call to understand your store setup, tracking stack, and reporting issues.',
              'Full GA4 + GTM ecommerce tracking audit for one Shopify store.',
              'Validation of core ecommerce events and critical parameters.',
              'A severity-ranked findings report: what’s broken, why it matters, and what to fix first.',
              'Implementation of the highest-priority fixes inside GTM and/or Shopify theme where feasible.',
              '1 walkthrough call or Loom showing what changed and what to monitor next.',
            ]}
          />
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-blue-800">Deliverables</h2>
          <Checklist
            items={[
              'Audit summary with prioritized issues.',
              'Before/after evidence from DebugView, Tag Assistant, and live testing.',
              'Updated GTM container or implementation notes.',
              'A short “can I trust my numbers now?” summary.',
              'Clear next-step recommendation: keep iterating on tracking or move into dashboard/reporting work.',
            ]}
          />
        </section>

        <section className="mb-16 rounded-lg border border-blue-100 bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold text-blue-800">What this is not</h2>
          <p className="text-lg leading-relaxed text-blue-700">
            This is not a full BI implementation, multi-source ETL build, or executive dashboard
            project. It is the fastest way to fix the measurement layer so future reporting and
            decision-making are based on cleaner data.
          </p>
        </section>

        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-blue-800">Timeline</h3>
            <p className="text-lg text-blue-700">
              Most audits are completed in 5–7 business days depending on store complexity and
              access.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold text-blue-800">Price</h3>
            <p className="text-xl font-bold text-blue-800">£900</p>
            <p className="mt-1 text-sm text-blue-600">
              for a standard Shopify GA4 & GTM audit for one store.
            </p>
            <p className="mt-4 text-lg font-bold text-blue-800">£1,200+</p>
            <p className="mt-1 text-sm text-blue-600">
              for more complex setups, such as multiple markets, custom implementations, or heavy
              app stacks.
            </p>
          </div>
        </div>

        <section className="mb-16 border-t border-blue-200 pt-12">
          <h2 className="mb-6 text-3xl font-bold text-blue-800">After the audit</h2>
          <p className="mb-6 text-lg leading-relaxed text-blue-700">
            Once your data is reliable, the next step is usually a unified reporting setup that
            brings Shopify, GA4, paid media, and lifecycle data into a single dashboard your team
            can actually use.
          </p>
          <p className="text-lg font-semibold text-blue-800">
            That’s where the Shopify Data Analytics Dashboard Sprint comes in.
          </p>
        </section>

        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Button
            text="Book a tracking audit"
            href="/contact"
            extraClasses="bg-red-500 text-white w-full sm:w-auto"
            noPadding={true}
          />
          <Button
            text="See the dashboard sprint"
            href="/services/dashboard-sprint"
            outline={true}
            extraClasses="w-full sm:w-auto"
            noPadding={true}
          />
        </div>
      </div>
    </SectionContainer>
  )
}
