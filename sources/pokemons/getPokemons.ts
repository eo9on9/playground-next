import { request } from './request'

export interface Pokemon {
  name: string
  url: string
}

export interface GetPokemonsRequestParams {
  limit: number
  offset: number
}

export interface GetPokemonsResponseDTO {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}

export interface GetPokemonsResponse {
  count: number
  next: {
    offset: number
    limit: number
  } | null
  previous: {
    offset: number
    limit: number
  } | null
  results: Pokemon[]
}

const fromDTO = (dto: GetPokemonsResponseDTO): GetPokemonsResponse => {
  const nextUrl = dto.next ? new URL(dto.next) : null
  const nextOffset = nextUrl?.searchParams.get('offset')
  const nextLimit = nextUrl?.searchParams.get('limit')

  const previousUrl = dto.previous ? new URL(dto.previous) : null
  const previousOffset = previousUrl?.searchParams.get('offset')
  const previousLimit = previousUrl?.searchParams.get('limit')

  return {
    ...dto,
    next: dto.next
      ? {
          offset: Number(nextOffset),
          limit: Number(nextLimit),
        }
      : null,
    previous: dto.previous
      ? {
          offset: Number(previousOffset),
          limit: Number(previousLimit),
        }
      : null,
  }
}

export const getPokemons = async (
  params: GetPokemonsRequestParams,
): Promise<GetPokemonsResponse> => {
  const response = await request.get<GetPokemonsResponseDTO>('/pokemon', {
    params,
  })

  return fromDTO(response)
}
