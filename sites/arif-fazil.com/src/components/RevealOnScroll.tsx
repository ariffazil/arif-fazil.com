import { useRef, useEffect, useState, type ReactNode } from 'react'

/**
 * RevealOnScroll — fade+slide entrance when element enters viewport.
 * Lightweight IntersectionObserver wrapper. No external deps.
 * Respects prefers-reduced-motion.
 */

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right'
}

export function RevealOnScroll({ children, delay = 0, className = '', direction = 'up' }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const translate = {
    up: 'translateY(24px)',
    left: 'translateX(-24px)',
    right: 'translateX(24px)',
  }[direction]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate,
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

export default RevealOnScroll
