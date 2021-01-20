import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchSections } from 'server/board/boardGateway'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string
    const sections = await fetchSections(boardId)

    res.status(200).json(sections)
  })
}
