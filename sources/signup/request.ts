import axios, { type AxiosRequestConfig, type Method } from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
})

const commonRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>(config)

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message)
    }
    throw error
  }
}

const requestFn =
  (method: Method) =>
  async <T>(url: string, config: AxiosRequestConfig): Promise<T> =>
    commonRequest<T>({ url, ...config, method })

export const request = {
  get: requestFn('GET'),
  post: requestFn('POST'),
  put: requestFn('PUT'),
  delete: requestFn('DELETE'),
}
