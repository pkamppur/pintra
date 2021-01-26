import type { NextApiRequest, NextApiResponse } from 'next'
import authenticatedRequest from 'server/authenticatedRequest'
import { boardContentGateway } from 'server/board/boardGatewayProvider'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string

    try {
      const gateway = await boardContentGateway(username, boardId)
      const board = await gateway.fetchBoard()

      res.status(200).json(board)
    } catch (e) {
      console.log(`[boardId] error ${JSON.stringify(e)}, error ${e}`)
      res.status(404)
      res.setHeader('Content-Type', 'application/problem+json')
      res.setHeader('Content-Language', 'en')
      res.json({ title: 'Invalid request', status: 404 })
    }
  })
}
