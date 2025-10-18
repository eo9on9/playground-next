# React Hook Form

## React Hook Form 쓰는 이유

“폼 상태, 유효성 검증, 에러 관리, 제출 처리”를 효율적으로 관리하기 위해서.
RHF는 브라우저 기본 폼 동작과 React의 상태 관리 방식을 결합해, 렌더링 최소화 + 선언적인 코드 + 간결한 검증 처리를 제공한다.

### React Hook Form을 사용하지 않았을 때의 문제점

> 예시 코드 sources/signup/VersionPure.tsx

- 상태와 에러를 직접 관리
- 유효성 검증을 직접 작성해야 함
- 모든 값 변경 시 리렌더 발생 → 성능 저하
- 코드가 길고 폼이 복잡해질수록 유지보수 어려움

### React Hook Form을 썼을 때 해결되는 점

> 예시 코드 sources/signup/VersionRHF.tsx

- 상태를 직접 관리할 필요 없음 (useState 불필요)
- register로 input에 바로 연결 → 이벤트 핸들링 코드 감소
- 유효성 검증 규칙을 선언적으로 정의
- 에러 메시지 관리 자동화
- 입력 변경 시 필요한 부분만 리렌더 → 성능 최적화
- 제출 함수는 “검증된 값”만 받게 되어 간결함
