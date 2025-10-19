import { css, keyframes } from '@emotion/react'
import { useQueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Show } from './Show'

interface ProfileShowPageProps {
  id?: string
}

export const ProfileShowPage = ({ id }: ProfileShowPageProps) => {
  const queryClient = useQueryClient()

  return (
    <div>
      <h1>Profile Show</h1>
      {id && (
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              문제 발생!
              <br />
              <button
                onClick={() => {
                  queryClient.resetQueries({ queryKey: ['user', id] })
                  resetErrorBoundary()
                }}
              >
                다시 시도
              </button>
            </div>
          )}
        >
          <Suspense
            fallback={
              <div
                css={[
                  skeletonCss,
                  css`
                    width: 400px;
                    height: 200px;
                  `,
                ]}
              />
            }
          >
            <Show id={id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const drift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const skeletonCss = css`
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;

  // background: linear-gradient(120deg, #ccc, #f7f7f7, #ccc);
  // background-size: 300% 300%;
  // border-radius: 6px;
  // animation: ${drift} 2s ease-in-out infinite;
`
