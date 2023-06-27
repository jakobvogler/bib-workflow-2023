import {connectDatabase} from "@/server/database"
import {ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import {createHash} from "crypto"
import Joi from "joi"
import type {NextApiRequest, NextApiResponse} from "next"
import validate from "../../server/lib/middlewares/validation"

export interface SignupPayload {
  email: string
  password: string
  code: string
}

export interface SignupResponse {
  success: boolean
}

const router = createRouter()

router.post(
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(128).required(),
      code: Joi.string().required(),
    }),
  }),
  async (req: NextApiRequest & {body: SignupPayload}, res: NextApiResponse<SignupResponse | ErrorResponse>) => {
    const database = await connectDatabase()

    const invite = await database.inviteModel.findOne({code: req.body.code})

    if (!invite || !invite.active || invite.usages >= invite.maxUsages) {
      return res.status(403).json({error: "Invalid Invite", message: "Invite code is invalid"})
    }

    const user = await database.userModel.findOne({email: req.body.email})

    if (user) {
      return res.status(409).json({error: "Conflict", message: "Email already registered"})
    }

    const password = createHash("sha256").update(req.body.password).digest("base64url")

    const newUser = {
      email: req.body.email,
      password: password,
      invite: String(invite._id),
    }

    await database.userModel.create(newUser)

    await database.inviteModel.findOneAndUpdate({_id: invite._id}, {usages: invite.usages + 1})

    res.status(201).json({success: true})
  },
)

export default router
