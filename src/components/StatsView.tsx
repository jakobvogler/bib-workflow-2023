import {Text} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import {APIService} from "../client/APIService"

function StatsView() {
  const [stats, setStats] = useState<any>({})

  const getStats = async () => {
    const stats = await APIService.getStats()
    setStats(stats)
  }

  useEffect(() => {
    getStats()
  }, [])

  return (
    <>
      <Text>Users: {stats?.users}</Text>
      <Text>Active Users: {stats?.activeUsers}</Text>
    </>
  )
}

export default StatsView
