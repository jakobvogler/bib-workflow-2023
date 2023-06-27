import {IUser} from "../server/models/user"
import {HttpRequest} from "../shared/HttpRequest"

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
}
