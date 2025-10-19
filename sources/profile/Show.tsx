import { useSuspenseQuery } from '@tanstack/react-query'
import { getUser } from './getUser'

export const Show = ({ id = '' }: { id?: string }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['user', id],
    queryFn: () => getUser({ id }),
    retry: false,
  })

  return (
    <div>
      <p>Name: {data?.name}</p>
      <p>Phone: {data?.phone}</p>
      <p>Address: {data?.address}</p>
    </div>
  )
}
