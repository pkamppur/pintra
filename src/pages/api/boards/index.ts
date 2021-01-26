import type { NextApiRequest, NextApiResponse } from 'next'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    // Unimplemented for now because of privacy/security
    res.status(200).json([])
  })
}
