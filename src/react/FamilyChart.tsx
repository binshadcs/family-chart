// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import createChart from '../createChart'

export interface FamilyChartProps {
  data: any
  className?: string
  style?: React.CSSProperties
  options?: any
}

/**
 * React wrapper component for the vanilla Family Chart library.
 *
 * Example usage:
 * ```tsx
 * <FamilyChart data={treeData} />
 * ```
 */
const FamilyChart: React.FC<FamilyChartProps> = ({ data, className, style, options }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, data)
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
    chart.updateTree({})

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [data, options])

  return <div ref={containerRef} className={className} style={style} />
}

export default FamilyChart
