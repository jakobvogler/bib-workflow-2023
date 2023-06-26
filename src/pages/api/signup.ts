import {connectDatabase} from "@/server/database"
import {ErrorResponse} from "@/server/lib/middlewares/error"
import {createHash} from "crypto"
import Joi from "joi"
import type {NextApiRequest, NextApiResponse} from "next"
import nextConnect from "next-connect"
import validate from "../../server/lib/middlewares/validation"

export interface SignupPayload {
  email: string
  password: string
}

export interface SignupResponse {
  success: boolean
}

const router = nextConnect()

router.post(
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(128).required(),
    }),
  }),
  async (req: NextApiRequest & {body: SignupPayload}, res: NextApiResponse<SignupResponse | ErrorResponse>) => {
    const database = await connectDatabase()
    const user = await database.userModel.findOne({identifier: req.body.username})

    if (user) {
      return res.status(409).json({error: "Conflict", message: "Email already registered"})
    }

    const password = createHash("sha256").update(req.body.password).digest("base64url")

    const newUser = {
      email: req.body.email,
      password: password,
    }

    await database.userModel.create(newUser)

    res.status(201).json({success: true})
  },
)

export default router
