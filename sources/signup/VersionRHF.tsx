import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { signup } from './signup'
import {
  VALIDATION_ID,
  VALIDATION_PASSWORD,
  VALIDATION_PASSWORD_CONFIRM,
  VALIDATION_PHONE,
  VALIDATION_REQUIRED,
} from './validation'

interface SignupForm {
  id: string
  password: string
  passwordConfirm: string
  phone: string
}

export const VersionRHF = () => {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<SignupForm>({})

  const { mutateAsync } = useMutation({ mutationFn: signup })

  const _handleSubmit = handleSubmit(async data => {
    try {
      const result = await mutateAsync(data)

      alert(result.message)
    } catch (error) {
      alert((error as Error)?.message)
    }
  })

  return (
    <form onSubmit={_handleSubmit}>
      <input
        type="text"
        {...register('id', {
          required: {
            value: true,
            message: '아이디는 6자 이상이어야 합니다.',
          },
          pattern: {
            value: VALIDATION_ID.pattern,
            message: VALIDATION_ID.message,
          },
        })}
      />
      {errors.id && <p>{errors.id.message}</p>}
      <br />
      <input
        type="password"
        {...register('password', {
          required: {
            value: true,
            message: VALIDATION_REQUIRED.message,
          },
          pattern: {
            value: VALIDATION_PASSWORD.pattern,
            message: VALIDATION_PASSWORD.message,
          },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}
      <br />
      <input
        type="password"
        {...register('passwordConfirm', {
          required: {
            value: true,
            message: VALIDATION_REQUIRED.message,
          },
          validate: {
            passwordConfirm: value => {
              if (value !== getValues('password')) {
                return VALIDATION_PASSWORD_CONFIRM.message
              }

              return true
            },
          },
        })}
      />
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
      <br />
      <input
        type="tel"
        {...register('phone', {
          required: {
            value: true,
            message: VALIDATION_REQUIRED.message,
          },
          pattern: {
            value: VALIDATION_PHONE.pattern,
            message: VALIDATION_PHONE.message,
          },
        })}
      />
      {errors.phone && <p>{errors.phone.message}</p>}
      <br />
      <button type="submit" disabled={!isValid}>
        회원가입
      </button>
    </form>
  )
}
