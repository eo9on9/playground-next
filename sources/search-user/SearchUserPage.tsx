import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { searchUser } from './search'

const CITY_OPTIONS = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'jeju', label: '제주' },
]

type KindOfCities = 'seoul' | 'busan' | 'jeju'

const SearchUserFormSchema = z.object({
  name: z.string().optional(),
  age: z.string().refine(value => value === '' || !isNaN(Number(value)), {
    message: 'only number',
  }),
  city: z.enum<(KindOfCities | '')[]>(['seoul', 'busan', 'jeju', '']),
})

type SearchUserForm = z.infer<typeof SearchUserFormSchema>

export const SearchUserPage = () => {
  const router = useRouter()
  const params = useSearchParams()

  const hasAnyQuery = useMemo(
    () => Array.from(params.keys()).length > 0,
    [params],
  )

  const queryObj: SearchUserForm = useMemo(() => {
    return {
      name: params.get('name') ?? '',
      age: params.get('age') ?? '',
      city: (params.get('city') as KindOfCities) ?? '',
    }
  }, [params])

  const { data, isLoading } = useQuery({
    queryKey: ['searchUser', queryObj],
    queryFn: () =>
      searchUser({
        name: queryObj.name === '' ? undefined : queryObj.name,
        age: queryObj.age === '' ? undefined : Number(queryObj.age),
        city: queryObj.city === '' ? undefined : queryObj.city,
      }),
    enabled: hasAnyQuery,
  })

  const {
    reset,
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SearchUserForm>({
    resolver: zodResolver(SearchUserFormSchema),
  })

  const onSubmit = (data: SearchUserForm) => {
    const q = new URLSearchParams()
    if (data.name?.trim()) q.set('name', data.name.trim())
    if (data.city?.trim()) q.set('city', data.city.trim())
    if (data.age) q.set('age', data.age.toString())
    const qs = q.toString()
    router.push(qs ? `?${qs}` : '?')
  }

  useEffect(() => {
    // defaultValues, dirtyFields, isSubmitted 등 모든 내부 상태를 초기화
    reset(queryObj)
  }, [queryObj, reset])

  return (
    <div>
      <h1>Search User</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="form-name">Name</label>
        <input id="form-name" type="text" {...register('name')} />

        <br />
        <br />

        <label htmlFor="form-age">Age</label>
        <input id="form-age" type="tel" {...register('age')} />
        {errors.age && <p>{errors.age.message}</p>}

        <br />
        <br />

        <label htmlFor="form-city">City</label>
        <Controller
          name="city"
          control={control}
          render={({ field: { value, onChange } }) => (
            <select id="form-city" value={value ?? ''} onChange={onChange}>
              <option value="" hidden>
                선택
              </option>
              {CITY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        />

        <br />
        <br />

        <button type="submit">Search</button>
      </form>

      <br />
      <br />

      {isLoading && <div>Loading...</div>}

      {data?.data && (
        <dl>
          <dt>Name</dt>
          <dd>{data?.data.name}</dd>
          <dt>Age</dt>
          <dd>{data?.data.age}</dd>
          <dt>City</dt>
          <dd>{data?.data.city}</dd>
        </dl>
      )}
    </div>
  )
}
