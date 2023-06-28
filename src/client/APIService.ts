import {IUser} from "../server/models/user"
import {HttpRequest} from "../shared/HttpRequest"

export interface IUpdateUserPayload {
  libraryIdentifier: string
  libraryPassword: string
  permanentSeat: string
}

export namespace APIService {
  function getToken() {
    return localStorage.getItem("token")
  }

  export async function getUser() {
    const {body} = await new HttpRequest("/api/user")
      .setMethod("GET")
      .setHeader("authorization", "Bearer " + getToken())
      .send<IUser>()

    return body
  }

  export async function updateUser(payload: IUpdateUserPayload) {
    const {body} = await new HttpRequest("/api/user")
      .setMethod("PUT")
      .setHeader("authorization", "Bearer " + getToken())
      .setJSONBody(payload)
      .send<IUser>()

    return body
  }

  export async function disablePermanentSeat() {
    const {body} = await new HttpRequest("/api/permanent-seat/disable")
      .setMethod("GET")
      .setHeader("authorization", "Bearer " + getToken())
      .send<IUser>()

    return body
  }

  export async function getStats() {
    const {body} = await new HttpRequest("/api/stats")
      .setMethod("GET")
      .setHeader("authorization", "Bearer " + getToken())
      .send<any>()

    return body
  }
}
