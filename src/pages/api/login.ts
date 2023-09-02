import {connectDatabase} from "@/server/database"
import {ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import {createHash} from "crypto"
import Joi from "joi"
import jwt from "jsonwebtoken"
import type {NextApiRequest, NextApiResponse} from "next"
import getConfig from "next/config"
import validate from "../../server/lib/middlewares/validation"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

const {serverRuntimeConfig} = getConfig()
const router = createRouter()

router.post(
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(128).required(),
    }),
  }),
  async (req: NextApiRequest & {body: LoginPayload}, res: NextApiResponse<LoginResponse | ErrorResponse>) => {
    const password = createHash("sha256").update(req.body.password).digest("base64url")

    const database = await connectDatabase()
    const user = await database.userModel.findOne({email: req.body.email, password: password})

    if (!user) {
      return res.status(401).json({error: "Unauthorized"})
    }

    const token = jwt.sign({userId: String(user._id)}, serverRuntimeConfig.HASH_SECRET, {expiresIn: 30 * 24 * 60 * 60})
    res.status(200).json({token: token})
  },
)

export default router
