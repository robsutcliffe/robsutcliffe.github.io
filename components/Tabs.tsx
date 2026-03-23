'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TabItem {
  title: string
  content: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
}

const Tabs = ({ items }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="mt-4 mb-8">
      {/* Mobile Accordion */}
      <div className="space-y-2 md:hidden">
        {items.map((item, index) => {
          const contentId = `tabpanel-mobile-${index}`
          const buttonId = `tab-mobile-${index}`
          const isOpen = activeTab === index
          return (
            <div key={index} className="border border-blue-800/50 bg-white">
              <button
                id={buttonId}
                className={`flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition-all duration-200 ${
                  isOpen ? 'bg-blue-500 text-white' : 'text-blue-800'
                }`}
                onClick={() => setActiveTab(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={contentId}
              >
                {item.title}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="max-w-none p-6">{item.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="scrollbar-hide flex overflow-x-auto" role="tablist">
          {items.map((item, index) => {
            const buttonId = `tab-desktop-${index}`
            const contentId = `tabpanel-desktop-${index}`
            const isSelected = activeTab === index
            return (
              <button
                key={index}
                id={buttonId}
                role="tab"
                aria-selected={isSelected}
                aria-controls={contentId}
                className={`px-6 text-sm leading-12 font-bold whitespace-nowrap uppercase transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-800 hover:bg-blue-500 hover:text-white'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {item.title}
              </button>
            )
          })}
        </div>
        <div className="shadow-inset-all tabs relative overflow-hidden bg-white p-4 px-6 transition duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`tabpanel-desktop-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-desktop-${activeTab}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-none"
            >
              {items[activeTab]?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Tabs
