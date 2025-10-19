import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  // const { id, password } = req.body

  // // TODO: 실제 인증 로직
  // const isValid = id && password
  // if (!isValid) return res.status(401).json({ message: 'Invalid credentials' })

  const now = new Date().getTime()

  // 예시: 서버에서 발급
  const accessToken = `ACCESS_${now}` // 짧은 만료
  const refreshToken = `REFRESH_${now}` // 긴 만료

  // Refresh -> httpOnly 쿠키로 세팅 (클라 JS에 노출 안 됨)
  const cookie = serialize('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // 크로스사이트 필요하면 'none' + secure:true
    path: '/', // 필요 범위에 맞춰 설정
    maxAge: 60 * 60 * 24 * 14, // 14d
  })

  res.setHeader('Set-Cookie', cookie)

  // Access는 바디로 내려, 클라가 메모리에 저장해 Authorization 헤더에 사용
  return res.status(200).json({ accessToken })
}
