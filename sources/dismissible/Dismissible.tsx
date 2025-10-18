import { useEffect, useRef } from 'react'

interface DismissibleProps {
  onDismiss?: () => void
  dismissOnEscape?: boolean
}

export const Dismissible = ({
  onDismiss,
  dismissOnEscape = true,
  children,
}: React.PropsWithChildren<DismissibleProps>) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss?.()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (dismissOnEscape && event.key === 'Escape') {
        onDismiss?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onDismiss, dismissOnEscape])

  return <div ref={ref}>{children}</div>
}
