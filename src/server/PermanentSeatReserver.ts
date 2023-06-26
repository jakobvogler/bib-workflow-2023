import {getCentralEuropeanTime} from "@/utils/time"
import {wait} from "@/utils/wait"
import {IUser} from "./models/user"
import {LibraryService} from "./services/LibraryService"

export namespace PermanentSeatReserver {
  export async function startWorkflow(user: IUser) {
    const reserveDate = new Date()
    reserveDate.setUTCHours(reserveDate.getUTCHours() + 5)
    reserveDate.setUTCDate(reserveDate.getUTCDate() + 3)

    const midnight = new Date(reserveDate)
    midnight.setUTCHours(0, 0, 0, 0)

    try {
      const cookie = await LibraryService.getCookie()

      await LibraryService.login(user.libraryIdentifier!, user.libraryPassword!, cookie)

      console.log(midnight.getTime() - getCentralEuropeanTime().getTime() - 10_000)
      return true
      await wait(midnight.getTime() - getCentralEuropeanTime().getTime() - 10_000)

      while (midnight.getTime() - getCentralEuropeanTime().getTime() > 150) {
        await wait(100)
      }

      const requests = []
      for (let i = 0; i < 10; i++) {
        requests.push(LibraryService.bookSeat(cookie!, user.libraryIdentifier!, user.permanentSeat!, reserveDate))
      }

      await Promise.allSettled(requests)

      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
