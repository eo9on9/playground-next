import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getUser } from './getUser'

export const Search = () => {
  const [id, setId] = useState('')

  const { data, refetch, isError, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser({ id }),
    enabled: false,
    retry: false,
  })

  const handleClick = () => {
    if (!id.trim()) return

    refetch()
  }

  console.log(data)

  return (
    <div>
      <input type="text" value={id} onChange={e => setId(e.target.value)} />
      <button onClick={handleClick}>Get User</button>
      <br />
      <br />
      {isError ? (
        <div>에러가 발생했습니다.</div>
      ) : isFetching ? (
        <div>로딩중...</div>
      ) : (
        data && (
          <div>
            <p>이름: {data.name}</p>
            <p>전화: {data.phone}</p>
            <p>주소: {data.address}</p>
          </div>
        )
      )}
    </div>
  )
}
