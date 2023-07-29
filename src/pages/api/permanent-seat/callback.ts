import {PermanentSeatReserver} from "@/server/PermanentSeatReserver"
import {connectDatabase} from "@/server/database"
import {ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import validate from "@/server/lib/middlewares/validation"
import Joi from "joi"
import type {NextApiRequest, NextApiResponse} from "next"

const router = createRouter()

router.get(
  validate({
    query: Joi.object({
      userId: Joi.string().required(),
    }),
  }),
  async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
    const database = await connectDatabase()

    const user = await database.userModel.findOne({_id: req.query.userId})

    if (!user) {
      return res.status(200).json({
        ok: false,
        message: "User not found",
      })
    }

    const ok = await PermanentSeatReserver.startWorkflow(user)

    res.status(200).json({
      ok: ok,
      message: "done",
    })
  },
)

export default router
