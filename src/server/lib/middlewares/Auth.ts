import {connectDatabase} from "@/server/database"
import Joi from "joi"
import jwt from "jsonwebtoken"
import {NextApiRequest} from "next"
import getConfig from "next/config"
import {ApiError} from "./errors"

const {serverRuntimeConfig} = getConfig()

export async function checkAuth(req: NextApiRequest) {
  try {
    Joi.object({
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).unknown(true),
    }).validate(req)
  } catch (e) {
    throw new ApiError(401, "Unauthorized")
  }

  const token = req.headers.authorization!.replace("Bearer ", "")

  let tokenObj: {userId: string}

  try {
    tokenObj = jwt.verify(token, serverRuntimeConfig.HASH_SECRET) as any
  } catch (e) {
    throw new ApiError(401, "Unauthorized")
  }

  const databse = await connectDatabase()
  const user = await databse.userModel.findOne({_id: tokenObj.userId})

  if (!user) {
    throw new ApiError(401, "Unauthorized")
  }

  return user
}
