import type { NextApiRequest, NextApiResponse } from 'next'
import { boardContentGateway } from 'server/board/boardGatewayProvider'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boardId = req.query.boardId as string
    const query = req.query.query as string

    try {
      if (!username || !boardId || !query) {
        console.log(`searchResults No content found`)
        res.status(404).json({ title: 'No content found' })
      }
      const gateway = await boardContentGateway(username, boardId)
      const searchResults = await gateway.searchCards(query)

      res.status(200).json(searchResults)
    } catch (e) {
      console.log(`[search] error ${JSON.stringify(e)}, error ${e}`)
      res.status(404)
      res.setHeader('Content-Type', 'application/problem+json')
      res.setHeader('Content-Language', 'en')
      res.json({ title: 'Invalid request', status: 404 })
    }
  })
}
