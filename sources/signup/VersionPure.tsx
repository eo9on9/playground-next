import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { signup, type SignupRequest } from './signup'
import {
  VALIDATION_ID,
  VALIDATION_PASSWORD,
  VALIDATION_PASSWORD_CONFIRM,
  VALIDATION_PHONE,
} from './validation'

export const VersionPure = () => {
  const [id, setId] = useState('')
  const [idError, setIdError] = useState('')

  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')

  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const mutation = useMutation({
    mutationFn: signup,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (idError || passwordError || passwordConfirmError || phoneError) return

    const formData = new FormData(e.target as HTMLFormElement)
    const { id, password, phone } = Object.fromEntries(
      formData,
    ) as SignupRequest

    try {
      const result = await mutation.mutateAsync({ id, password, phone })

      alert(result.message)
    } catch (error) {
      alert((error as Error)?.message)
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)

    if (!VALIDATION_ID.pattern.test(e.target.value)) {
      setIdError(VALIDATION_ID.message)
    } else {
      setIdError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)

    if (!VALIDATION_PASSWORD.pattern.test(e.target.value)) {
      setPasswordError(VALIDATION_PASSWORD.message)
    } else {
      setPasswordError('')
    }
  }

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(e.target.value)

    if (password !== e.target.value) {
      setPasswordConfirmError(VALIDATION_PASSWORD_CONFIRM.message)
    } else {
      setPasswordConfirmError('')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)

    if (!VALIDATION_PHONE.pattern.test(e.target.value)) {
      setPhoneError(VALIDATION_PHONE.message)
    } else {
      setPhoneError('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        placeholder="아이디"
        value={id}
        onChange={handleIdChange}
      />
      {idError && <p>{idError}</p>}
      <br />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={password}
        onChange={handlePasswordChange}
      />
      {passwordError && <p>{passwordError}</p>}
      <br />
      <input
        type="password"
        name="passwordConfirm"
        placeholder="비밀번호 확인"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
      />
      {passwordConfirmError && <p>{passwordConfirmError}</p>}
      <br />
      <input
        type="tel"
        name="phone"
        placeholder="전화번호"
        value={phone}
        onChange={handlePhoneChange}
      />
      {phoneError && <p>{phoneError}</p>}
      <br />
      <button type="submit">회원가입</button>
    </form>
  )
}
