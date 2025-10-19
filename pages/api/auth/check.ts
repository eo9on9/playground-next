import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 요청 헤더에서 Authorization 값 가져오기
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 없습니다.' })
  }

  // "Bearer ACCESS_123456789" 형태로 온 경우 고려
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()

  // "ACCESS_" 접두사 확인
  if (!token.startsWith('ACCESS_')) {
    return res.status(400).json({ message: '토큰 형식이 올바르지 않습니다.' })
  }

  // timestamp 추출
  const timestampStr = token.split('_')[1]
  const timestamp = Number(timestampStr)

  if (isNaN(timestamp)) {
    return res.status(400).json({ message: '잘못된 timestamp입니다.' })
  }

  const now = Date.now()
  const diffSeconds = (now - timestamp) / 1000

  if (diffSeconds > 5) {
    // 5초 이상 지난 경우
    return res.status(401).json({ message: '토큰이 만료되었습니다.' })
  }

  // 유효한 경우
  return res.status(200).json({ message: 'ok' })
}
