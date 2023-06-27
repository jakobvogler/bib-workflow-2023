import jwt from "jsonwebtoken"

export function isValidToken() {
  const token = localStorage.getItem("token")

  if (!token) {
    return false
  }

  const jwToken: any = jwt.decode(token)

  return typeof jwToken === "object" && jwToken.exp > Date.now() / 1000
}
