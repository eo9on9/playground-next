# Error Boundary

## Error Boundary 쓰는 이유

React에서는 컴포넌트 렌더링 중 에러가 발생하면 트리 전체가 깨져버림.
Error Boundary는 그걸 막고, 해당 영역만 대체 UI로 교체(fallback)해주는 UI 복원 장치.

즉, 앱 전체가 죽지 않게 하고, 사용자는 “부분 오류”만 경험하도록 만든다.

### Error Boundary 코드 패턴

| 구분                     | 패턴                                                           | 특징                                             |
| ------------------------ | -------------------------------------------------------------- | ------------------------------------------------ |
| ❌ 에러 바운더리 없이    | `useQuery` → `isError`, `error.message` 로 직접 분기           | 각 컴포넌트가 스스로 에러 UI 처리                |
| ✅ 에러 바운더리 사용 시 | `<ErrorBoundary fallback={<ErrorUI/>}>` + `throwOnError: true` | 에러 발생 시 `throw` → 상위 ErrorBoundary가 처리 |

### Error Boundary 장점

- UI 안정성 확보: 특정 섹션만 교체되므로 앱 전체 크래시 방지
- 코드 단순화: 개별 컴포넌트마다 isError 분기 안 해도 됨
- 선언적 코드: “에러 시 이 UI를 보여줘”라고 상태 대신 결과 중심으로 기술 → 명령형 분기보다 읽기 쉽고 구조가 명확함
- Suspense와 통합 가능: 로딩·에러 UI를 fallback으로 자연스럽게 분리

## Error Boundary + React Query

### useQuery와의 관계

- throwOnError: false → 에러를 상태로 저장 (isError, error)
- throwOnError: true → 에러를 실제로 throw → ErrorBoundary가 캐치

즉, ErrorBoundary를 쓰려면 throwOnError: true 가 필요함.

### useSuspenseQuery와의 관계

useSuspenseQuery는 Suspense + ErrorBoundary 통합 버전
내부적으로 throwOnError가 항상 활성화되어 있어서, 로딩 시 Promise, 에러 시 Error를 자동으로 던짐.
