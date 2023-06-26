import {LIBRARY_BASE_URL} from "../../../config"
import {LibraryHttpRequest} from "../LibraryHttpRequest"

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

  export async function login(username: string, password: string, sessionId?: string) {
    const payload = new URLSearchParams()

    payload.set("NewUserName", username)
    payload.set("NewUserPassword", password)
    payload.set("Action", "SetName")

    const request = new LibraryHttpRequest(LIBRARY_BASE_URL + "/sitzplatzreservierung/admin.php")
      .setMethod("POST")
      .setFormBody(payload)

    if (sessionId) {
      request.setSessionId(sessionId)
    }

    const {body} = await request.send<string>()

    return body
  }

  export async function bookSeat(sessionId: string, userId: string, roomId: string, date: Date) {
    const payload = new URLSearchParams()

    payload.set("name", userId)
    payload.set("create_by", userId)
    payload.set("start_day", `${date.getDate()}`)
    payload.set("end_day", `${date.getDate()}`)
    payload.set("start_month", `${date.getMonth()}`)
    payload.set("end_month", `${date.getMonth()}`)
    payload.set("start_year", `${date.getFullYear()}`)
    payload.set("end_year", `${date.getFullYear()}`)
    payload.set("start_seconds", "43380")
    payload.set("end_seconds", "43380")
    payload.set("area", "42")
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
