import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type Method,
} from 'axios'
import { clearTokens, getAccessToken, setAccessToken } from './tokenStorage'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
})

type RefreshResponse = { accessToken: string }

async function refresh(): Promise<RefreshResponse> {
  // 인터셉터가 없는 인스턴스로 호출해서 재귀/무한루프 방지
  const res = await axios.post<RefreshResponse>(
    '/api/auth/refresh',
    {},
    { withCredentials: true },
  )
  return res.data
}

// 현재 진행 중인 리프레시 작업을 가리키는 Promise 캐시.
let refreshPromise: Promise<string> | null = null

function getFreshAccessToken(): Promise<string> {
  // 동시에 또 호출되면: 기존 refreshPromise를 그대로 공유 대기
  if (!refreshPromise) {
    refreshPromise = refresh()
      .then(({ accessToken }) => {
        setAccessToken(accessToken)
        return accessToken
      })
      .finally(() => {
        // 프로미스 캐시 삭제
        refreshPromise = null
      })
  }
  return refreshPromise
}

axiosInstance.interceptors.request.use(config => {
  const accessToken = getAccessToken()

  if (accessToken) {
    const auth = `Bearer ${accessToken}`
    config.headers.Authorization = auth
    // 보낼 당시의 Authorization 문자열 저장 (나중에 401이 왔을 때 현재 토큰과 비교해서 늦게 도착한 401인지 판단하려고)
    // ;(
    //   config as AxiosRequestConfig & {
    //     _authSnapshot?: string
    //   }
    // )._authSnapshot = auth
  }

  return config
})

axiosInstance.interceptors.response.use(
  // onFulfilled
  res => res,
  // onRejected
  async (error: AxiosError) => {
    // 실패한 원요청 설정을 꺼낸다.
    const original = error.config as AxiosRequestConfig & {
      _retry?: boolean // 무한루프 방지용. 이 요청을 한 번만 재시도하게 하려는 플래그.
      _authSnapshot?: string // 보낼 당시의 토큰 문자열(요청 인터셉터에서 넣어둔 값).
    }

    // 인증 만료(401) 이고, 아직 재시도한 적 없는 요청만 처리.
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true

      // refresh 엔드포인트에서 401이면 즉시 중단
      const url = original.url ?? ''
      if (url.includes('/auth/refresh')) {
        clearTokens()
        return Promise.reject(error)
      }

      // 지금 시점의 최신 토큰으로 만든 Authorization 문자열.
      const current = getAccessToken() ? `Bearer ${getAccessToken()}` : null
      // 요청 보낼 때 붙였던 Authorization 스냅샷.
      // const sent =
      //   original._authSnapshot ??
      //   (original.headers?.Authorization as string | undefined) ??
      //   null
      const sent =
        (original.headers?.Authorization as string | undefined) ?? null

      // 둘이 다르면 “요청을 보낼 땐 구 토큰이었지만, 지금은 이미 새 토큰으로 바뀌었다”는 뜻 → 리프레시를 다시 할 필요 없다.
      if (current && sent && current !== sent) {
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: current,
        }
        return axiosInstance(original)
      }

      // 내가 리프레시 시작
      try {
        // 누가 이미 리프레시 중이면 같은 Promise를 공유 대기.
        const newAccess = await getFreshAccessToken()

        // 새 토큰으로 헤더 바꿔서 원요청 재시도.
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: `Bearer ${newAccess}`,
        }
        return axiosInstance(original)
      } catch (e) {
        // 리프레시 실패 시 토큰 클리어 & 에러 전파
        clearTokens()
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  },
)

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
  async <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    commonRequest<T>({ url, method, ...config })

export const request = {
  get: requestFn('GET'),
  post: requestFn('POST'),
  put: requestFn('PUT'),
  delete: requestFn('DELETE'),
}
