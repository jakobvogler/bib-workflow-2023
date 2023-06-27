import {connectDatabase} from "@/server/database"
import {ErrorResponse} from "@/server/lib/middlewares/error"
import {LibraryService} from "@/server/services/LibraryService"
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

interface UpdateUserRequest extends NextApiRequest {
  body: {
    libraryIdentifier: string
    libraryPassword: string
    permanentSeat: string
  }
}

router.put(
  validate({
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(true),
    body: Joi.object({
      libraryIdentifier: Joi.string().required(),
      libraryPassword: Joi.string().required(),
      permanentSeat: Joi.string().required(),
    }),
  }),
  async (req: UpdateUserRequest, res: NextApiResponse<any | ErrorResponse>) => {
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

    const cookie = await LibraryService.getCookie()
    if (!cookie) {
      return res.status(500).json({error: "Internal Server Error"})
    }

    const login = await LibraryService.login(req.body.libraryIdentifier, req.body.libraryPassword, cookie)

    if (!login.includes(req.body.libraryIdentifier)) {
      return res.status(400).json({error: "Incorrect Credentials", message: "Library credentials are incorrect"})
    }

    const updated = await database.userModel.updateOne({_id: user._id}, {...req.body, active: true}, {new: true})

    res.status(200).json(updated)
  },
)

export default router
