import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signup, SignupRequest } from './signup'
import {
  VALIDATION_ID,
  VALIDATION_PASSWORD,
  VALIDATION_PASSWORD_CONFIRM,
  VALIDATION_PHONE,
  VALIDATION_REQUIRED,
} from './validation'

const SignupFormSchema = z
  .object({
    id: z
      .string()
      .min(1, VALIDATION_REQUIRED.message)
      .regex(VALIDATION_ID.pattern, VALIDATION_ID.message),
    password: z
      .string()
      .min(1, VALIDATION_REQUIRED.message)
      .regex(VALIDATION_PASSWORD.pattern, VALIDATION_PASSWORD.message),
    passwordConfirm: z.string().min(1, VALIDATION_REQUIRED.message),
    phone: z
      .string()
      .min(1, VALIDATION_REQUIRED.message)
      .regex(VALIDATION_PHONE.pattern, VALIDATION_PHONE.message),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: VALIDATION_PASSWORD_CONFIRM.message,
    path: ['passwordConfirm'],
  })

type SignupForm = z.infer<typeof SignupFormSchema>

const SignupParamsSchema = SignupFormSchema.transform<SignupRequest>(
  ({ id, password, phone }) => ({ id, password, phone }),
)

export const VersionRHFZod = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupFormSchema),
  })

  const { mutateAsync } = useMutation({ mutationFn: signup })

  const _handleSubmit = handleSubmit(async data => {
    try {
      const result = await mutateAsync(SignupParamsSchema.parse(data))

      alert(result.message)
    } catch (error) {
      alert((error as Error)?.message)
    }
  })

  return (
    <form onSubmit={_handleSubmit}>
      <input type="text" {...register('id')} />
      {errors.id && <p>{errors.id.message}</p>}
      <br />
      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      <br />
      <input type="password" {...register('passwordConfirm')} />
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
      <br />
      <input type="tel" {...register('phone')} />
      {errors.phone && <p>{errors.phone.message}</p>}
      <br />
      <button type="submit">회원가입</button>
    </form>
  )
}
