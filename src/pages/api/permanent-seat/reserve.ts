import {checkAuth} from "@/server/lib/middlewares/Auth"
import {ApiError, ErrorResponse, createRouter} from "@/server/lib/middlewares/errors"
import {
  IBookSeatPayload,
  LibraryFloor,
  LibraryIllegalTimeSlot,
  LibraryService,
  LibraryTimeSlot,
} from "@/server/services/LibraryService"
import type {NextApiRequest, NextApiResponse} from "next"

const router = createRouter()

router.get(async (req: NextApiRequest & {query: {reserveDate?: string}}, res: NextApiResponse<any | ErrorResponse>) => {
  const user = await checkAuth(req)

  if (!user.active) {
    throw new ApiError(400, "User inactive", "User not active")
  }

  const cookie = await LibraryService.getCookie()

  if (!cookie) {
    throw new ApiError(400, "Cookie Failure", "Cookie could not be generated")
  }

  const loginBody = await LibraryService.login(user.libraryIdentifier!, user.libraryPassword!, cookie)

  if (!loginBody.includes(user.libraryIdentifier!)) {
    throw new ApiError(400, "Login Failure", "Could not login")
  }

  let reserveDate = new Date()
  if (req.query.reserveDate) {
    reserveDate = new Date(req.query.reserveDate)
  }

  const request: IBookSeatPayload = {
    userId: user.libraryIdentifier!,
    roomId: user.permanentSeat!,
    date: reserveDate,
    floor: LibraryFloor.first,
    startTimeSlot: LibraryIllegalTimeSlot.morningAndMidday,
    endTimeSlot: LibraryIllegalTimeSlot.morningAndMidday,
  }

  if (user.mergeReserve) {
    await LibraryService.bookSeat(request, cookie)
  }

  request.startTimeSlot = LibraryTimeSlot.midday
  request.endTimeSlot = LibraryTimeSlot.midday

  await LibraryService.bookSeat(request, cookie)

  request.startTimeSlot = LibraryTimeSlot.morning
  request.endTimeSlot = LibraryTimeSlot.morning

  await LibraryService.bookSeat(request, cookie)

  res.status(200).json({message: "done"})
})

export default router
