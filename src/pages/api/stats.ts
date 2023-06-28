import {connectDatabase} from "@/server/database"
import {checkAuth} from "@/server/lib/middlewares/Auth"
import {ApiError, ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import type {NextApiRequest, NextApiResponse} from "next"

const router = createRouter()

router.get(async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const user = await checkAuth(req)

  if (!user.admin) {
    throw new ApiError(401, "Unauthorized")
  }

  const database = await connectDatabase()

  const [users, activeUsers] = await Promise.all([
    database.userModel.countDocuments(),
    database.userModel.countDocuments({active: true}),
  ])

  res.status(200).json({users, activeUsers})
})

export default router
