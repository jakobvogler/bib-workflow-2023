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

    try {
      const cookie = await LibraryService.getCookie()

      await LibraryService.login(user.libraryIdentifier!, user.libraryPassword!, cookie!)

      const request: IBookSeatPayload = {
        userId: user.libraryIdentifier!,
        roomId: user.permanentSeat!,
        date: reserveDate,
        floor: LibraryFloor.first,
        timeSlot: LibraryTimeSlot.midday,
      }

      await wait(midnight.getTime() - getCentralEuropeanTime().getTime() - 10_000)

      while (midnight.getTime() - getCentralEuropeanTime().getTime() > 100) {
        await wait(100)
      }

      const requests = []
      for (let i = 0; i < 5; i++) {
        requests.push(LibraryService.bookSeat(request, cookie!))
        await wait(50)
      }

      await Promise.allSettled(requests)

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
