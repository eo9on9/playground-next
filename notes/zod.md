# Zod

## Zod 쓰는 이유

Zod는 “타입 정의 + 유효성 검증 + 데이터 변환”을 하나의 스키마에 통합하는 도구다.
TypeScript는 개발 시점(compile-time) 검증만 가능하지만,
Zod는 *실행 시점(runtime)*에도 입력 데이터가 올바른지 검사해준다.

즉, **“타입이 맞는지 믿는 것이 아니라, 실제로 검사한다”**는 점이 핵심이다.

### React Hook Form만 쓰는 경우

> 예시 코드 sources/signup/VersionRHF.tsx

- 유효성 검증 규칙을 register 옵션으로 직접 정의한다
- 입력 필드마다 검증 로직이 흩어져 있다
- 에러 메시지도 필드별로 따로 작성해야 한다

### React Hook Form + Zod를 쓰는 경우

> 예시 코드 sources/signup/VersionRHFZod.tsx

- 검증 규칙을 **폼 외부의 스키마(Zod)**에서 정의
- register는 필드 연결만 담당하고, 검증 로직은 모두 스키마에 집중된다
- 폼 구조와 검증 규칙이 분리되어 코드가 더 깔끔해진다

## 유저 입력 폼 - API 요청 데이터의 관계에서 Zod

### 문제 상황

- 사용자 입력 값은 UI에 맞춘 형태로 들어옴 (예: 문자열, 공백 포함, UI용 필드 포함)
- 서버(API)는 정확한 타입과 필드 구조를 요구함 (예: 숫자 변환, 공백 제거, 필드명 변경 등)

즉, "폼 입력 형식"과 "API 요청 형식"이 다를 수 있다. 이 간극을 Zod가 transform 기능으로 자연스럽게 메워줄 수 있다.

```ts
const SignupFormSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(1),
  phone: z.string().min(1),
  address: z.string(),
})

// transform을 통해 API 요청 DTO로 변환
const SignupRequestSchema = SignupFormSchema.transform(data => ({
  userId: data.id,
  password: data.password,
  phoneNumber: data.phone.replace(/-/g, ''), // 불필요한 문자 제거
  address: data.address.trim(),
}))

// 사용 예시
const requestData = SignupRequestSchema.parse(formInput)
```

“스키마 → 검증 → 변환 → 반환” 과정이 런타임에서 실행되기 때문에, 개발자가 믿는 값이 아니라 “실제로 검증된 값”만 API로 전달되며, 이는 곧 안정성 보장을 의미한다.
