import {LIBRARY_BASE_URL} from "../../../config"
import {LibraryHttpRequest} from "../LibraryHttpRequest"

export enum LibraryFloor {
  ground = "40",
  first = "42",
  second = "34",
  secondGallery = "35",
  third = "44",
}

export enum LibraryTimeSlot {
  morning = "43200",
  midday = "43260",
  evening = "43320",
  night = "43380",
}

export enum LibraryIllegalTimeSlot {
  morningAndMidday = "43201",
  middayAndEvening = "43261",
  eveningAndNight = "43321",
}

export interface IBookSeatPayload {
  userId: string
  roomId: string
  date: Date
  floor: LibraryFloor
  startTimeSlot: LibraryTimeSlot | LibraryIllegalTimeSlot
  endTimeSlot: LibraryTimeSlot | LibraryIllegalTimeSlot
}

export namespace LibraryService {
  export async function getCookie() {
    const {response} = await new LibraryHttpRequest(LIBRARY_BASE_URL + "/sitzplatzreservierung/day.php")
      .setMethod("GET")
      .send<string>()

    return response.headers.get("set-cookie")?.split(";")[0].split("=")[1]
  }

  export async function getDay(sessionId?: string) {
    const request = new LibraryHttpRequest(LIBRARY_BASE_URL + "/sitzplatzreservierung/day.php").setMethod("GET")

    if (sessionId) {
      request.setSessionId(sessionId)
    }

    const {body} = await request.send<string>()

    return body
  }

  export async function login(username: string, password: string, sessionId: string) {
    const payload = new URLSearchParams()

    payload.set("NewUserName", username)
    payload.set("NewUserPassword", password)
    payload.set("Action", "SetName")

    const {body} = await new LibraryHttpRequest(LIBRARY_BASE_URL + "/sitzplatzreservierung/admin.php")
      .setMethod("POST")
      .setFormBody(payload)
      .setSessionId(sessionId)
      .send<string>()

    return body
  }

  export async function bookSeat(body: IBookSeatPayload, sessionId: string) {
    const {userId, roomId, date, floor, startTimeSlot, endTimeSlot} = body

    const payload = new URLSearchParams()

    payload.set("name", userId)
    payload.set("create_by", userId)
    payload.set("start_day", `${date.getDate()}`)
    payload.set("end_day", `${date.getDate()}`)
    payload.set("start_month", `${date.getMonth() + 1}`)
    payload.set("end_month", `${date.getMonth() + 1}`)
    payload.set("start_year", `${date.getFullYear()}`)
    payload.set("end_year", `${date.getFullYear()}`)
    payload.set("start_seconds", startTimeSlot)
    payload.set("end_seconds", endTimeSlot)
    payload.set("area", floor)
    payload.set("rooms[]", roomId)
    payload.set("type", "K")
    payload.set("confirmed", "1")

    const response = await new LibraryHttpRequest(LIBRARY_BASE_URL + "/sitzplatzreservierung/edit_entry_handler.php")
      .setMethod("POST")
      .setSessionId(sessionId)
      .setFormBody(payload)
      .send<string>()

    return response
  }
}
