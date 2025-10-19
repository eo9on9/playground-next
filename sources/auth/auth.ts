import { request } from './request'

interface LoginResponse {
  accessToken: string
}

export const login = async (): Promise<LoginResponse> => {
  const response = await request.post<LoginResponse>('/auth/login')

  return response
}

export interface RefreshResponse {
  accessToken: string
}

export const refresh = async (): Promise<RefreshResponse> => {
  const response = await request.post<RefreshResponse>('/auth/refresh', {
    withCredentials: true,
  })

  return response
}

interface CheckResponse {
  message: string
}

export const check = async (): Promise<CheckResponse> => {
  const response = await request.get<CheckResponse>('/auth/check')

  return response
}
