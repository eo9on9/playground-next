import { request } from './request'

export interface GetUserRequestParams {
  id: string
}

export interface GetUserResponseDTO {
  u_name: string
  u_phone: string
  u_address: string
}

export interface GetUserResponse {
  name: string
  phone: string
  address: string
}

const fromDTO = (dto: GetUserResponseDTO): GetUserResponse => {
  return {
    name: dto.u_name,
    phone: dto.u_phone,
    address: dto.u_address,
  }
}

export const getUser = async (
  params: GetUserRequestParams,
): Promise<GetUserResponse> => {
  const response = await request.get<GetUserResponseDTO>(`/users/${params.id}`)

  return fromDTO(response)
}
