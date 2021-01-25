import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchBoard } from 'server/board/boardGateway'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string

    try {
      const board = await fetchBoard('userId', boardId)

      res.status(200).json(board)
    } catch (e) {
      res.status(404)
      res.setHeader('Content-Type', 'application/problem+json')
      res.setHeader('Content-Language', 'en')
      res.json({ title: 'Invalid request', status: 404 })
    }
  })
}
