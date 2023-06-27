import {connectDatabase} from "@/server/database"
import {checkAuth} from "@/server/lib/middlewares/Auth"
import {ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import type {NextApiRequest, NextApiResponse} from "next"

const router = createRouter()

router.get(async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const user = await checkAuth(req)

  const database = await connectDatabase()
  const updated = await database.userModel.findOneAndUpdate({_id: user._id}, {active: false}, {new: true})

  res.status(200).json(updated)
})

export default router
