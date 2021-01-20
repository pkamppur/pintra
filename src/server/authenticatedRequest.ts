import type { NextApiRequest, NextApiResponse } from 'next'
import { userFromAuthToken } from './authentication'

export default function authenticatedRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (username: string) => Promise<void>
) {
  _asyncAuthenticatedRequest(req, res, handler)
}

async function _asyncAuthenticatedRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (username: string) => Promise<void>
) {
  try {
    const username = await authenticatedUser(req)

    await handler(username)
  } catch (error) {
    const title = error instanceof Error ? error.message : 'Invalid request'

    res.status(404)
    res.setHeader('Content-Type', 'application/problem+json')
    res.setHeader('Content-Language', 'en')
    res.json({ title, status: 404 })
    return
  }
}

async function authenticatedUser(req: NextApiRequest) {
  const authToken = req.rawHeaders.find((header) => header === 'pintra_auth')

  if (!authToken) {
    throw new Error('Invalid authentication')
  }

  return await userFromAuthToken(authToken)
}
