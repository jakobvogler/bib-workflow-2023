import {PermanentSeatReserver} from "@/server/PermanentSeatReserver"
import {connectDatabase} from "@/server/database"
import {ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import type {NextApiRequest, NextApiResponse} from "next"

const router = createRouter()

router.get(async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const database = await connectDatabase()

  const users = await database.userModel.find({active: true})

  const workflows = []

  for (const user of users) {
    workflows.push(PermanentSeatReserver.startWorkflow(user))
  }

  await Promise.all(workflows)

  res.status(200).json({
    message: "done",
  })
})

export default router
