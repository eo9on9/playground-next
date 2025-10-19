import { parse, serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  const refresh = cookies['refresh_token']
  if (!refresh) return res.status(401).json({ message: 'No refresh token' })

  const now = new Date().getTime()

  // TODO: refresh 검증 & (선택) 토큰 회전
  const nextAccess = `ACCESS_${now}`
  const nextRefresh = `REFRESH_${now}` // 회전한다면 새 쿠키 발급

  const set = serialize('refresh_token', nextRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
  res.setHeader('Set-Cookie', set)

  return res.status(200).json({ accessToken: nextAccess })
}
