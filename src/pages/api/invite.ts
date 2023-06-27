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
  const invite = await database.inviteModel.findOne({_id: req.query.id})

  if (!invite) {
    throw new ApiError(404, "Not Found", "Invite not found")
  }

  res.status(200).json(invite)
})

router.post(
  // validate({
  //   body: Joi.object({
  //     libraryIdentifier: Joi.string().required(),
  //     libraryPassword: Joi.string().required(),
  //     permanentSeat: Joi.string().required(),
  //   }),
  // }),
  async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
    const user = await checkAuth(req)

    if (!user.admin) {
      throw new ApiError(401, "Unauthorized")
    }

    const database = await connectDatabase()

    const invite = await database.inviteModel.findOne({code: req.body.code})

    if (invite) {
      throw new ApiError(400, "Duplicate")
    }

    const newInvite = await database.inviteModel.create(req.body)

    res.status(201).json(newInvite)
  },
)

export default router
