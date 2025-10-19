// tokenStorage.ts
// type Tokens = { accessToken: string | null }

// const memory: Tokens = { accessToken: null }

const ACCESS_KEY = 'access_token'

/** 앱 시작 시, 새로고침을 고려해 localStorage→메모리로 동기화(선택) */
// export function initTokensFromStorage() {
//   // try {
//   const v = localStorage.getItem(ACCESS_KEY)
//   if (v) memory.accessToken = v
//   // } catch {}
// }

export function getAccessToken() {
  // return memory.accessToken
  return localStorage.getItem(ACCESS_KEY)
}

export function setAccessToken(token: string) {
  // memory.accessToken = token
  // try {
  localStorage.setItem(ACCESS_KEY, token)
  // } catch {}
}

export function clearTokens() {
  // memory.accessToken = null
  // try {
  localStorage.removeItem(ACCESS_KEY)
  // } catch {}
}
