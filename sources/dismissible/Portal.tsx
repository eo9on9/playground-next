import { createPortal } from 'react-dom'

export const Portal = ({ children }: React.PropsWithChildren) => {
  return createPortal(children, document.body)
}
