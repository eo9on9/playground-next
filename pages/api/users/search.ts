import type { NextApiRequest, NextApiResponse } from 'next'

type UserRequest = {
  name?: string
  age?: string
  city?: string
}

type UserResponse = {
  success: true
  message: string
  data: { name?: string; age?: string; city?: string } | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: true,
      message: 'Only GET method is allowed',
      data: null,
    })
  }

  const { name, age, city } = req.query as UserRequest

  // if (!name || !age || !city) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'name, age, city 모두 입력해야 합니다.',
  //   })
  // }

  return res.status(200).json({
    success: true,
    message: 'User search successful',
    data: {
      name,
      age,
      city,
    },
  })
}
