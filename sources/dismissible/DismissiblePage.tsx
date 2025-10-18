import { css } from '@emotion/react'
import { useState } from 'react'
import { Dismissible } from './Dismissible'
import { Portal } from './Portal'

export const DismissiblePage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <h1>Dismissible</h1>
      <div
        css={css`
          position: relative;
        `}
      >
        <button onClick={() => setIsOpen(true)}>Open panel</button>
        {isOpen && (
          <Portal>
            <Dismissible onDismiss={() => setIsOpen(false)}>
              <div
                css={css`
                  position: absolute;
                  top: 50%;
                  left: 0;
                  width: 400px;
                  height: 200px;
                  padding: 16px;
                  border: 2px solid lime;
                `}
              >
                <h2>Panel</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </p>
              </div>
            </Dismissible>
          </Portal>
        )}
      </div>
      <div style={{ height: '1000px' }}></div>
    </div>
  )
}
