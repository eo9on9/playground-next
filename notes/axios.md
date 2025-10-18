# Axios

## Axios 쓰는 이유

fetch만 사용할 경우 반복되는 설정과 응답 처리 로직을 매번 작성해야 하며, 코드가 장황해지고 오류 가능성이 높아진다.
axios는 이러한 반복을 줄이고, 공통 설정과 응답 처리를 자동화하여 개발 효율성과 안정성을 높이기 위해 사용한다.

### Axios를 쓰지 않는 코드 패턴

```ts
/**
 * 매번 headers, body, res.ok 체크, res.json() 호출 필요
 * 에러 구조가 일관되지 않음 → 매 요청마다 분기 처리 필요
 */

const res = await fetch('/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

if (!res.ok) throw new Error('Request failed')
const result = await res.json()
```

### Axios를 쓰는 코드 패턴

```ts
/**
 * baseURL, headers, timeout 등은 전역 설정으로 한 번만 지정
 * JSON 파싱 자동 처리
 * 에러 처리도 인터셉터에서나 요청 래퍼 함수에서 일괄 관리 가능
 */

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

const res = await api.post('/user', data)
const result = res.data
```

## Axios 공통 처리 패턴

| 방식                       | 특징                                                      | 장점                            | 단점                                   |
| -------------------------- | --------------------------------------------------------- | ------------------------------- | -------------------------------------- |
| **Interceptor 사용**       | axios 인스턴스에 전역적으로 응답/에러를 가로채 가공       | 모든 API에 자동 적용, 코드 간결 | 전역적인 로직이 복잡해지면 추적 어려움 |
| **공통 request 래퍼 함수** | `api.request(config)`를 감싸서 성공/실패 응답 형식을 통일 | 타입 지정, API별 가공 로직 명확 | 매번 함수 호출 필요, 함수 설계가 중요  |

### 랩핑 함수

응답 데이터 구조를 프론트에서 사용하기 쉬운 형태로 통일하고 싶을 때 사용.
이를 request 함수에서 처리하면 API 호출부는 항상 같은 방식으로 결과를 다룰 수 있어 유지보수성이 높아진다.

```ts
async function request<T>(
  config,
): Promise<{ success: boolean; data: T | null; error?: string }> {
  try {
    const res = await api.request<T>(config)
    return { success: true, data: res.data.result ?? res.data }
  } catch (error) {
    return { success: false, data: null, error: error.response?.data.message }
  }
}
```
