import React from 'react'
import TableWrapper from './TableWrapper'

interface MatrixRow {
  feature: string
  essentials: string
  growth: string
  enterprise: string
  isPricing?: boolean
}

interface MatrixProps {
  items: MatrixRow[]
  columns?: {
    feature: string
    essentials: string
    growth: string
    enterprise: string
  }
}

const renderValue = (value: string) => {
  if (value === '–') {
    return <span className="opacity-30">{value}</span>
  }

  if (value.includes('\n')) {
    return (
      <div className="flex flex-col gap-1">
        {value.split('\n').map((line, i) => (
          <span key={i} className={i > 0 ? 'text-xs opacity-80' : ''}>
            {line}
          </span>
        ))}
      </div>
    )
  }
  return value
}

const Matrix = ({ items, columns }: MatrixProps) => {
  const pricingRows = items.filter((item) => item.isPricing)
  const featureRows = items.filter((item) => !item.isPricing)

  const headers = columns || {
    feature: 'Feature / Benefit',
    essentials: 'Essentials',
    growth: 'Growth',
    enterprise: 'Enterprise',
  }

  const getColumnTitle = (key: string) => {
    if (columns) return (columns as any)[key]
    return (headers as any)[key]
  }

  return (
    <div className="not-prose my-8 text-sm md:text-base">
      <TableWrapper>
        <table className="w-fit border-collapse border-b border-blue-950/30">
          <thead>
            <tr className="bg-blue-950 text-xs text-white md:text-sm">
              <th className="border-b border-blue-950/30 p-4 text-left align-top font-semibold">
                {/* Header Feature cell is empty or hidden for pricing rows */}
              </th>
              {[
                { key: 'essentials' as const, fallback: 'Essentials' },
                { key: 'growth' as const, fallback: 'Growth' },
                { key: 'enterprise' as const, fallback: 'Enterprise' },
              ].map((col) => {
                const title = getColumnTitle(col.key) || col.fallback
                return (
                  <th
                    key={col.key}
                    className="border-b border-blue-950/30 p-4 text-center align-top font-semibold text-white"
                  >
                    <div className="flex h-full flex-col items-center justify-start">
                      <span className="mb-1">{title}</span>
                      {pricingRows.map((row, i) => {
                        const val = row[col.key]
                        if (val === '–') return null

                        const parts = val.split(/\s+then\s+/i)

                        return (
                          <div key={i} className="mt-1 flex flex-col items-center">
                            {parts.map((part, partIdx) => {
                              const isPerMonth =
                                part.toLowerCase().includes('/month') ||
                                part.toLowerCase().includes('monthly') ||
                                part.toLowerCase().includes('per month')
                              const priceOnly = part
                                .split('\n')[0]
                                .replace(/\/month/i, '')
                                .replace(/monthly/i, '')
                                .replace(/per month/i, '')
                                .trim()

                              return (
                                <div key={partIdx} className="flex flex-col items-center">
                                  {partIdx > 0 && (
                                    <span className="my-0.5 text-[8px] tracking-wider uppercase opacity-60">
                                      then
                                    </span>
                                  )}
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold md:text-2xl">
                                      {priceOnly}
                                    </span>
                                    {isPerMonth && (
                                      <span className="text-xs font-normal opacity-60">/month</span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="text-sm">
            {featureRows.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-blue-950/30 p-4 font-medium text-blue-950">
                  {renderValue(item.feature)}
                </td>
                <td className="border-b border-blue-950/30 p-4 text-center text-blue-900">
                  {renderValue(item.essentials)}
                </td>
                <td className="border-b border-blue-950/30 p-4 text-center text-blue-900">
                  {renderValue(item.growth)}
                </td>
                <td className="border-b border-blue-950/30 p-4 text-center text-blue-900">
                  {renderValue(item.enterprise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  )
}

export default Matrix
