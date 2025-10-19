import type { NextApiRequest, NextApiResponse } from 'next'

type User = {
  u_id: string
  u_name: string
  u_phone: string
  u_address: string
}

// "DB 흉내" — 실제로는 메모리에 저장
const mockUsers: User[] = [
  {
    u_id: '1',
    u_name: '김철수',
    u_phone: '010-1234-5678',
    u_address: '서울시 강남구 테헤란로 1',
  },
  {
    u_id: '2',
    u_name: '이영희',
    u_phone: '010-8765-4321',
    u_address: '부산시 해운대구 우동 123',
  },
  {
    u_id: '3',
    u_name: '박민수',
    u_phone: '010-1111-2222',
    u_address: '대전시 서구 둔산동 456',
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const user = mockUsers.find(u => u.u_id === id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (Math.random() < 0.2) {
    return res
      .status(500)
      .json({ message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
  }

  const { u_name, u_phone, u_address } = user

  return res.status(200).json({ u_name, u_phone, u_address })
}
