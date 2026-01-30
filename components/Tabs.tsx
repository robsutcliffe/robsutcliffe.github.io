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
    <div className="not-prose my-8">
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
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            {items[activeTab].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Tabs
