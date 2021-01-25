import type { NextApiRequest, NextApiResponse } from 'next'
import { boardContentGateway } from 'server/board/boardContentGatewayProvider'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    //const boardId = req.query.boardId as string
    //const gateway = await boardContentGateway(username, boardId)
    //const sections = await gateway.fetchSections(boardId)
    //res.status(200).json(sections)
    res.status(404).json({ status: 404 })
  })
}
