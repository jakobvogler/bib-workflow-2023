import {connectDatabase} from "@/server/database"
import {checkAuth} from "@/server/lib/middlewares/Auth"
import {ApiError, ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import {LibraryService} from "@/server/services/LibraryService"
import Joi from "joi"
import type {NextApiRequest, NextApiResponse} from "next"
import validate from "../../server/lib/middlewares/validation"

const router = createRouter()

router.get(async (req: NextApiRequest, res: NextApiResponse<any | ErrorResponse>) => {
  const user = await checkAuth(req)
  res.status(200).json(user)
})

interface UpdateUserRequest extends NextApiRequest {
  body: {
    libraryIdentifier: string
    libraryPassword: string
    permanentSeat: string
  }
}

router.put(
  validate({
    body: Joi.object({
      libraryIdentifier: Joi.string().required(),
      libraryPassword: Joi.string().required(),
      permanentSeat: Joi.string().required(),
    }),
  }),
  async (req: UpdateUserRequest, res: NextApiResponse<any | ErrorResponse>) => {
    const user = await checkAuth(req)

    const cookie = await LibraryService.getCookie()
    if (!cookie) {
      throw new Error()
    }

    const login = await LibraryService.login(req.body.libraryIdentifier, req.body.libraryPassword, cookie)

    if (!login.includes(req.body.libraryIdentifier)) {
      throw new ApiError(400, "Incorrect Credentials", "Library credentials are incorrect")
    }

    const database = await connectDatabase()

    const duplicate = await database.userModel.findOne({permanentSeat: req.body.permanentSeat})
    if (duplicate && String(duplicate._id) !== String(user._id)) {
      throw new ApiError(400, "Seat taken", "Seat has already been registered")
    }

    const updated = await database.userModel.findOneAndUpdate({_id: user._id}, {...req.body, active: true}, {new: true})

    res.status(200).json(updated)
  },
)

export default router
