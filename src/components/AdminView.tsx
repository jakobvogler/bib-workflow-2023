import {Button, Text} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import {APIService} from "../client/APIService"

function AdminView() {
  const router = useRouter()

  const [stats, setStats] = useState<any>({})

  const getStats = async () => {
    const stats = await APIService.getStats()
    setStats(stats)
  }

  const openUserData = async () => {
    const w = window.open("about:blank", "_blank")

    const data = await APIService.getUserData()

    w?.document.write("<pre>" + JSON.stringify(data, null, 4) + "</pre>")
  }

  useEffect(() => {
    getStats()
  }, [])

  return (
    <>
      <Text>
        Active Users: {stats?.activeUsers} / {stats?.users}
      </Text>
      <Button colorScheme={"teal"} onClick={openUserData}>
        Users
      </Button>
    </>
  )
}

export default AdminView
