import jwt from "jsonwebtoken"
import {useRouter} from "next/router"
import {useEffect} from "react"

export default function RedirectView() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/signup")
      return
    }

    const jwToken: any = jwt.decode(token)

    if (typeof jwToken !== "object" || jwToken.exp < Date.now() / 1000) {
      router.push("/login")
    }

    router.push("/dashboard")
  }, [])
}
