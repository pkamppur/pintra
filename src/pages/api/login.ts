import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticate } from 'server/authentication'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as { username?: string; password?: string }
  const username = body.username
  const password = body.password

  if (username && password) {
    const token = await authenticate(username, password)

    if (!token) {
      res.status(403)
      res.setHeader('Content-Type', 'application/problem+json')
      res.setHeader('Content-Language', 'en')
      res.json({ title: 'Invalid username or password', status: 403 })
      return
    }

    res.status(200).json({ token })
    return
  }

  res.status(400)
  res.setHeader('Content-Type', 'application/problem+json')
  res.setHeader('Content-Language', 'en')
  res.json({ title: 'Missing parameters', status: 400 })
}
