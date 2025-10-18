// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// "DB 흉내" — 실제로는 메모리에 저장
const mockUsers: { id: string; password: string; phone: string }[] = [
  { id: 'iamminsu', password: 'Abc!1234', phone: '01012345678' },
  { id: 'iameunji', password: 'Qwe@5678', phone: '01087654321' },
  { id: 'iamharu', password: 'Zxc#9999', phone: '01055558888' },
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { id, password, phone } = req.body

  // 단순 유효성 검사
  if (!id || !password || !phone) {
    return res.status(400).json({ message: '필수 항목이 누락되었습니다.' })
  }

  // 아이디 중복 체크 (mock)
  const isDuplicate = mockUsers.some(user => user.id === id)
  if (isDuplicate) {
    return res.status(409).json({ message: '이미 존재하는 아이디입니다.' })
  }

  // 일부러 랜덤하게 실패시키는 코드 (테스트용)
  if (Math.random() < 0.2) {
    return res
      .status(500)
      .json({ message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
  }

  // 회원 등록
  mockUsers.push({ id, password, phone })

  // 응답
  return res.status(201).json({
    message: '회원가입이 완료되었습니다.',
    user: { id, phone },
  })
}
