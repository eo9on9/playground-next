import { request } from './request'

interface SearchUserParams {
  name?: string
  age?: number
  city?: string
}

type SearchUserResponse = {
  success: boolean
  message: string
  data: { name?: string; age?: string; city?: string } | null
}

export const searchUser = async (
  params: SearchUserParams,
): Promise<SearchUserResponse> => {
  const response = await request.get<SearchUserResponse>('/users/search', {
    params,
  })

  return response
}
