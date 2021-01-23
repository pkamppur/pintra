import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchBoards } from 'server/board/boardGateway'
import authenticatedRequest from 'server/authenticatedRequest'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await authenticatedRequest(req, res, async (username) => {
    const boards = await fetchBoards(username)

    res.status(200).json(boards)
  })
}
