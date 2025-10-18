import { useEffect, useRef } from 'react'

interface IntersectionDetectorProps {
  onDetect: () => void
}

export const IntersectionDetector = ({
  onDetect,
}: IntersectionDetectorProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onDetect?.()
    })

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [onDetect])

  return <div ref={ref} />
}
