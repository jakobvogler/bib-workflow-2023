import {getCentralEuropeanTime} from "@/utils/time"
import {wait} from "@/utils/wait"
import {IUser} from "./models/user"
import {IBookSeatPayload, LibraryFloor, LibraryService, LibraryTimeSlot} from "./services/LibraryService"

export namespace PermanentSeatReserver {
  export async function startWorkflow(user: IUser) {
    const reserveDate = new Date()
    reserveDate.setUTCHours(reserveDate.getUTCHours() + 5)
    reserveDate.setUTCDate(reserveDate.getUTCDate() + 3)

    const midnight = new Date()
    midnight.setUTCDate(midnight.getUTCDate() + 1)
    midnight.setUTCHours(0, 0, 0, 0)

    const cookie = await LibraryService.getCookie()

    let isLoggedIn = false
    for (let i = 0; i < 10; i++) {
      const body = await LibraryService.login(user.libraryIdentifier!, user.libraryPassword!, cookie!)

      if (body.includes(user.libraryIdentifier!)) {
        isLoggedIn = true
        break
      }
    }

    if (!isLoggedIn) {
      return false
    }

    const middayRequest: IBookSeatPayload = {
      userId: user.libraryIdentifier!,
      roomId: user.permanentSeat!,
      date: reserveDate,
      floor: LibraryFloor.first,
      timeSlot: LibraryTimeSlot.midday,
    }
    const morningRequest: IBookSeatPayload = {...middayRequest, timeSlot: LibraryTimeSlot.morning}

    await wait(midnight.getTime() - getCentralEuropeanTime().getTime() - 10_000)

    while (midnight.getTime() - getCentralEuropeanTime().getTime() > 100) {
      await wait(100)
    }

    const requests = []
    for (let i = 0; i < 10; i++) {
      requests.push(bookSeatAndCatch(middayRequest, cookie!))
      await wait(50)
    }

    for (let i = 0; i < 10; i++) {
      requests.push(bookSeatAndCatch(middayRequest, cookie!))
      requests.push(bookSeatAndCatch(morningRequest, cookie!))
      await wait(50)
    }

    await Promise.all(requests)

    return true
  }
}

async function bookSeatAndCatch(body: IBookSeatPayload, sessionId: string) {
  let response

  try {
    response = await LibraryService.bookSeat(body, sessionId)
  } catch (e) {}

  return response
}
