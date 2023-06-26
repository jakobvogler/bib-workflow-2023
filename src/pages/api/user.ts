import {connectDatabase} from "@/server/database"
import {ErrorResponse} from "@/server/lib/middlewares/error"
import Joi from "joi"
import jwt from "jsonwebtoken"
import type {NextApiRequest, NextApiResponse} from "next"
import nextConnect from "next-connect"
import getConfig from "next/config"
import validate from "../../server/lib/middlewares/validation"

const {serverRuntimeConfig} = getConfig()
const router = nextConnect()

router.get(
  validate({
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(true),
  }),
  async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
    const token = req.headers.authorization!.replace("Bearer ", "")

    let tokenObj: {userId: string}

    try {
      tokenObj = jwt.verify(token, serverRuntimeConfig.HASH_SECRET) as any
    } catch (e) {
      return res.status(401).json({error: "Unauthorized"})
    }

    const databse = await connectDatabase()
    const user = await databse.userModel.findOne({_id: tokenObj.userId})

    if (!user) {
      return res.status(401).json({error: "Unauthorized"})
    }

    res.status(200).json(user)
  },
)

router.put(
  validate({
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object({
      libraryIdentifier: Joi.string().required(),
      libraryPassword: Joi.string().required(),
    }),
  }),
  async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
    const token = req.headers.authorization!.replace("Bearer ", "")

    let tokenObj: {userId: string}

    try {
      tokenObj = jwt.verify(token, serverRuntimeConfig.HASH_SECRET) as any
    } catch (e) {
      return res.status(401).json({error: "Unauthorized"})
    }

    const database = await connectDatabase()
    const user = await database.userModel.findOne({_id: tokenObj.userId})

    if (!user) {
      return res.status(401).json({error: "Unauthorized"})
    }

    const updated = await database.userModel.updateOne({_id: user._id}, {...req.body, active: true})

    res.status(200).json(updated)
  },
)

export default router
