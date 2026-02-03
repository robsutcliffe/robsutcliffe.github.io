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
    <div className="not-prose mt-4 mb-8">
      {/* Mobile Accordion */}
      <div className="space-y-2 md:hidden">
        {items.map((item, index) => (
          <div key={index} className="border border-blue-950/50 bg-white">
            <button
              className={`flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition-all duration-200 ${
                activeTab === index ? 'bg-blue-500 text-white' : 'text-blue-950'
              }`}
              onClick={() => setActiveTab(activeTab === index ? -1 : index)}
            >
              {item.title}
              <motion.span
                animate={{ rotate: activeTab === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
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
              {activeTab === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="prose prose-sm max-w-none p-6">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="scrollbar-hide flex overflow-x-auto">
          {items.map((item, index) => (
            <button
              key={index}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === index
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-950 hover:bg-blue-500 hover:text-white'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="relative overflow-hidden border border-blue-950/50 bg-white p-6 transition duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="prose prose-sm max-w-none"
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
