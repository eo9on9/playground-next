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
  // withCredentials 필요하면 옵션 추가
  const res = await axios.post<RefreshResponse>(
    '/api/auth/refresh',
    {},
    { withCredentials: true },
  )
  return res.data
}

let refreshPromise: Promise<string> | null = null

function getFreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refresh()
      .then(({ accessToken }) => {
        setAccessToken(accessToken)
        return accessToken
      })
      .finally(() => {
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
    // 보낼 당시의 토큰 문자열을 저장. 나중에 401이 왔을 때, 현재 토큰과 보낼 때 토큰이 다른지 비교해 늦게 도착한 401을 식별하려는 목적.
    ;(
      config as AxiosRequestConfig & {
        _authSnapshot?: string
      }
    )._authSnapshot = auth
  }

  return config
})

axiosInstance.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & {
      _retry?: boolean
      _authSnapshot?: string
    }

    // 401만 처리 + 무한루프 방지
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true

      // (A) refresh 엔드포인트에서 401이면 즉시 중단 (재귀 방지)
      const url = original.url ?? ''
      if (url.includes('/auth/refresh')) {
        clearTokens()
        return Promise.reject(error)
      }

      // (B) 늦게 도착한 401: 스냅샷과 현재 토큰 다르면 리프레시 없이 재시도
      const current = getAccessToken() ? `Bearer ${getAccessToken()}` : null
      const sent =
        original._authSnapshot ??
        (original.headers?.Authorization as string | undefined) ??
        null

      if (current && sent && current !== sent) {
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: current,
        }
        return axiosInstance(original)
      }

      // (C) 정말 필요한 경우에만 shared promise로 리프레시
      try {
        const newAccess = await getFreshAccessToken()
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: `Bearer ${newAccess}`,
        }
        return axiosInstance(original) // 실패했던 원 요청 재시도
      } catch (e) {
        clearTokens()
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  },
)

// 리프레시 API 호출의 “공유 Promise”. 이미 누가 리프레시 중이면 모두 이걸 같이 기다리도록 해서 한 번만 리프레시 되게 한다.
// let refreshPromise: Promise<RefreshResponse> | null = null

// “지금 리프레시 중인지”를 나타내는 플래그. (큐 방식과 함께 동작)
// let isRefreshing = false

// // 리프레시 완료를 기다리는 대기자 콜백 리스트 → 완료되면 새 토큰을 전달해주거나 실패면 null을 전파.
// let pendingQueue: Array<(token: string | null) => void> = []

// // 리프레시가 끝나면(성공/실패 상관없이) 줄 서있던 모든 요청에게 결과를 뿌린다. -> 성공이면 새 토큰, 실패면 null을 전파.
// function processQueue(token: string | null) {
//   pendingQueue.forEach(resolve => resolve(token))
//   pendingQueue = []
// }

// function getFreshAccessToken() {
//   // 이미 리프레시 중이면 기존 refreshPromise를 그대로 반환(같이 기다림).
//   if (!refreshPromise) {
//     // refresh()로 새 Promise를 만들고 refreshPromise에 저장 → 다음 401들도 같은 걸 기다리게.
//     refreshPromise = refresh().finally(() => {
//       // finally에서 refreshPromise를 null로 돌려놔서 다음번 401 때 새로 만들 수 있게 한다.
//       refreshPromise = null
//     })
//   }

//   return refreshPromise
// }

// axiosInstance.interceptors.response.use(
//   // onFulfilled
//   res => res,
//   // onRejected
//   async (error: AxiosError) => {
//     // original은 실패한 원 요청의 설정(재시도할 때 다시 쓰려고 꺼내옴)
//     const original = error.config as AxiosRequestConfig & {
//       _retry?: boolean // 무한 루프 방지용 깃발. 이 요청을 한 번만 재시도하게 하려는 플래그.
//       _authSnapshot?: string // 보낼 당시의 토큰 문자열(요청 인터셉터에서 넣어둔 값).
//     }

//     // 인증 만료(401) 이고, 아직 재시도한 적 없는 요청만 처리.
//     if (error.response?.status === 401 && !original?._retry) {
//       original._retry = true

//       // refresh 엔드포인트 가드 (재귀/루프 방지)
//       const url = original.url ?? ''
//       if (url.includes('/auth/refresh')) {
//         clearTokens()
//         return Promise.reject(error)
//       }

//       // 지금 시점의 최신 토큰으로 만든 Authorization 문자열.
//       const current = getAccessToken() ? `Bearer ${getAccessToken()}` : null
//       // 요청 보낼 때 붙였던 Authorization 스냅샷.
//       const sent =
//         original._authSnapshot ??
//         (original.headers?.Authorization as string | undefined) ??
//         null

//       // 둘이 다르면 “요청을 보낼 땐 구 토큰이었지만, 지금은 이미 새 토큰으로 바뀌었다”는 뜻 → 리프레시를 다시 할 필요 없다.
//       if (current && sent && current !== sent) {
//         // 현재 토큰으로 헤더 갈아끼우고 재시도.
//         original.headers = { ...original.headers, Authorization: current }
//         return axiosInstance(original)
//       }

//       // 다른 요청이 이미 리프레시를 시작한 상태라면,
//       if (isRefreshing) {
//         // 내 요청은 큐에 resolve를 넣고 기다린다(리프레시 결과를 공유).
//         const token = await new Promise<string | null>(resolve =>
//           pendingQueue.push(resolve),
//         )

//         // 리프레시 결과가 없으면,
//         if (!token) {
//           clearTokens() // 토큰 클리어
//           return Promise.reject(error) // 에러 전파
//         }

//         // 리프레시 성공이면, 현재 토큰으로 헤더 갈아끼우고 재시도.
//         original.headers = {
//           ...original.headers,
//           Authorization: `Bearer ${token}`,
//         }
//         return axiosInstance(original)
//       }

//       // 리프레시 아직 없으면 내가 시작한다.
//       isRefreshing = true
//       try {
//         // const { accessToken: newAccess } = await getFreshAccessToken()
//         const { accessToken: newAccess } = await refresh()

//         // 새 토큰 저장
//         setAccessToken(newAccess)
//         // 대기중인 요청들에 새 토큰 전파
//         processQueue(newAccess)

//         // 원 요청의 헤더를 새 토큰으로 교체하고 재시도
//         original.headers = {
//           ...original.headers,
//           Authorization: `Bearer ${newAccess}`,
//         }

//         return axiosInstance(original)
//       } catch (e) {
//         processQueue(null) // 대기중인 요청들에 실패 알림
//         clearTokens() // 로컬 토큰 제거

//         // TODO: 라우팅으로 로그인 페이지 이동 등

//         return Promise.reject(e)
//       } finally {
//         // 리프레시 완료 후 플래그 해제
//         isRefreshing = false
//       }
//     }

//     return Promise.reject(error)
//   },
// )

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
