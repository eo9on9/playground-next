export const VALIDATION_ID = {
  pattern: /^[a-z0-9]{6,}$/,
  message: '아이디는 6자 이상이어야 합니다.',
}

export const VALIDATION_PASSWORD = {
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
  message:
    '비밀번호는 영문 소문자, 대문자, 특수문자를 포함하여 6자 이상이어야 합니다.',
}

export const VALIDATION_PHONE = {
  pattern: /^[0-9]{10,11}$/,
  message: '전화번호는 숫자만 포함하여 10~11자여야 합니다.',
}

export const VALIDATION_REQUIRED = {
  message: '필수 입력 항목입니다.',
}

export const VALIDATION_PASSWORD_CONFIRM = {
  message: '비밀번호가 일치하지 않습니다.',
}
