import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchSections } from 'server/board/boardGateway'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const boardId = req.query.boardId as string
  const sections = await fetchSections(boardId)

  res.status(200).json(sections)
}
