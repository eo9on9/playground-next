import { css } from '@emotion/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPokemons, type GetPokemonsResponse } from './getPokemons'
import { IntersectionDetector } from './IntersectionDetector'

export const PokemonsPage = () => {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['pokemons'],
    getNextPageParam: (lastPage: GetPokemonsResponse) => lastPage.next,
    initialPageParam: { offset: 0, limit: 20 },
    queryFn: ({ pageParam }) => getPokemons(pageParam),
  })

  const isInitialLoading = data?.pages.length === 0

  const handleIntersectionDetect = () => {
    if (!isInitialLoading && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div
      css={css`
        padding: 24px;
      `}
    >
      <h1>Pokemons</h1>
      <ul>
        {data?.pages
          .flatMap(page => page.results)
          .map((result, index) => (
            <li
              key={result.name}
              css={css`
                padding: 12px;
              `}
            >
              {index + 1} - {result.name}
            </li>
          ))}
      </ul>

      <IntersectionDetector onDetect={handleIntersectionDetect} />
    </div>
  )
}
