import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCardContent } from 'server/board/boardGateway'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const boardId = req.query.boardId as string
  const cardId = req.query.cardId as string
  console.log(`api boardId: ${boardId}`)
  console.log(`api cardId: ${cardId}`)
  const cardContent = await fetchCardContent(boardId, cardId)

  res.status(200).json(cardContent)
}
