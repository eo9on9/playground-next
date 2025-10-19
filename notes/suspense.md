# Suspense

## Suspense 쓰는 이유

일반적으로 API 요청이나 데이터 준비 과정에서 컴포넌트마다 isLoading 분기 코드를 써야 함.
Suspense는 이걸 “로딩 중일 때 이 UI를 보여줘” 라는 선언적 형태로 바꿔준다.
로딩 상태를 개별적으로 제어하지 않고, React가 “Promise를 던질 때” 자동으로 fallback UI를 표시한다.

### Suspense 코드 패턴

| 구분      | 패턴                                | 특징                                         |
| --------- | ----------------------------------- | -------------------------------------------- |
| ❌ 미사용 | `isLoading` 분기 직접 작성          | 각 컴포넌트가 로딩 상태를 직접 관리 (명령형) |
| ✅ 사용   | `<Suspense fallback={<Skeleton/>}>` | 로딩 시 자동으로 fallback 렌더 (선언형)      |

### Suspense 장점

- 코드 단순화: isLoading 분기 제거, UI 구조가 깔끔해짐
- UI 일관성: 여러 컴포넌트가 동시에 로드돼도 한 곳에서 fallback 관리
- 선언적 코드: “로딩 중엔 이걸 보여줘”를 명시하므로, 로딩 상태를 imperative하게 관리하지 않아도 됨
- 에러 바운더리와 궁합: Suspense가 로딩 중 fallback을, ErrorBoundary가 에러 fallback을 담당 → 완벽한 UI 복원 구조

## Suspense와 React Query

| 훅                             | 로딩 처리 방식                           | 에러 처리 방식                              |
| ------------------------------ | ---------------------------------------- | ------------------------------------------- |
| `useQuery`                     | `isLoading` / `isFetching` 상태로 제어   | `isError` / `error` 상태로 제어             |
| `useQuery({ suspense: true })` | Suspense fallback으로 대체               | `throwOnError: true`로 ErrorBoundary에 던짐 |
| `useSuspenseQuery`             | **Suspense 내장** (로딩 시 Promise 던짐) | **ErrorBoundary 내장** (에러 시 Error 던짐) |
