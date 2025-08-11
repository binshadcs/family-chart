// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import createChart from '../createChart'
import CardSvg from '../Cards/CardSvg'

export interface FamilyChartProps {
  data: any
  className?: string
  style?: React.CSSProperties
  options?: any
  card?: any
}

/**
 * React wrapper component for the vanilla Family Chart library.
 *
 * Example usage:
 * ```tsx
 * <FamilyChart data={treeData} />
 * ```
 */
const FamilyChart: React.FC<FamilyChartProps> = ({ data, className, style, options, card }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, data)
    chart.setCard(card || CardSvg)
    if (options && chart) {
      Object.entries(options).forEach(([key, value]) => {
        if (typeof chart[key] === 'function') {
          try {
            chart[key](value)
          } catch {
            // ignore bad option
          }
        }
      })
    }
    chart.updateTree({ initial: true })

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [data, options, card])

  const combinedClassName = ['f3', className].filter(Boolean).join(' ')
  const combinedStyle = { width: '100%', height: '100%', ...(style || {}) }

  return <div ref={containerRef} className={combinedClassName} style={combinedStyle} />
}

export default FamilyChart
