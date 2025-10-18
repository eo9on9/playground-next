import { request } from '../lib/request'

export type SignupRequest = {
  id: string
  password: string
  phone: string
}

export type SignupResponse = {
  message: string
  user?: {
    id: string
    phone: string
  }
}

export async function signup(data: SignupRequest) {
  const res = await request.post<SignupResponse>('/signup', { data })

  return res
}
