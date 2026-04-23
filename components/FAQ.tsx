'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: React.ReactNode
}

interface FAQProps {
  items: FAQItem[]
}

const FAQ = ({ items }: FAQProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="shadow-inset-all -mx-4 mt-4 sm:mx-0">
      {items.map((item, index) => {
        const contentId = `faq-content-${index}`
        const buttonId = `faq-button-${index}`
        const isOpen = activeIndex === index
        return (
          <div key={index} className={index === items.length - 1 ? '' : 'shadow-inset-b'}>
            <button
              id={buttonId}
              className={`${isOpen ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'} flex w-full items-center justify-between px-4 py-5 text-left leading-6 transition-colors sm:px-6`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <span className="font-semibold">{item.question}</span>
              <span className="ml-4 flex-shrink-0" aria-hidden="true">
                <svg
                  className={`h-6 w-6 transform transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto' },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="shadow-inset-b mx-[1px] max-w-none border-t border-blue-800 bg-white px-6 pt-2 pb-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default FAQ
