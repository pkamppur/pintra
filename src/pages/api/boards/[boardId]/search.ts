import type { NextApiRequest, NextApiResponse } from 'next'
import { boardContentGateway } from 'server/board/boardGatewayProvider'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string
    const query = req.query.query as string

    if (!username || !boardId || !query) {
      console.log(`searchResults No content found`)
      res.status(404).json({ title: 'No content found' })
    }
    const gateway = await boardContentGateway(username, boardId)
    const searchResults = await gateway.searchCards(query)

    res.status(200).json(searchResults)
  })
}
