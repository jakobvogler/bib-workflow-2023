import {APIService} from "@/client/APIService"
import {IUser} from "@/server/models/user"
import {ArrowForwardIcon, CloseIcon, SunIcon} from "@chakra-ui/icons"
import {Box, Button, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, Stack} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"

export default function DashboardView() {
  const router = useRouter()

  const [token, setToken] = useState<string>("")
  const [user, setUser] = useState<IUser>()

  const [libraryIdentifier, setLibraryIdentifier] = useState<string>("")
  const [libraryPassword, setLibraryPassword] = useState<string>("")
  const [permanentSeat, setPermanentSeat] = useState<string>("")

  const getUser = async () => {
    try {
      const user = (await APIService.getUser()) as IUser
      setUser(user)
    } catch (e) {
      alert("Error loading user")
    }
  }

  const update = async () => {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({libraryIdentifier, libraryPassword, permanentSeat}),
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    setUser(out)
  }

  const disable = async () => {
    const response = await fetch("/api/permanent-seat/disable", {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: "Bearer " + token,
      },
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    setUser(out)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
    }

    getUser()
    setToken(token!)
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    setLibraryIdentifier(user.libraryIdentifier ?? "")
    setLibraryPassword(user.libraryPassword ?? "")
    setPermanentSeat(user.permanentSeat ?? "")
  }, [user])

  return (
    <FormControl isRequired>
      <Stack maxW={"80"} spacing={"4"}>
        <HStack>
          <Heading>Dashboard</Heading>
          {user?.active ? <SunIcon color={"green"} /> : <CloseIcon color={"red"} />}
        </HStack>
        <Box>
          <FormLabel>Library Identifier</FormLabel>
          <Input
            placeholder={"identifier"}
            value={libraryIdentifier}
            onChange={(e) => setLibraryIdentifier(e.target.value)}
          />
          <FormHelperText>Please use the library number, not the student number starting with '@'</FormHelperText>
        </Box>
        <Box>
          <FormLabel>Library Password</FormLabel>
          <Input
            type={"password"}
            placeholder={"password"}
            value={libraryPassword}
            onChange={(e) => setLibraryPassword(e.target.value)}
          />
        </Box>
        <Box>
          <FormLabel>Permanent Seat</FormLabel>
          <Input placeholder={"identifier"} value={permanentSeat} onChange={(e) => setPermanentSeat(e.target.value)} />
          <FormHelperText>Please put here the roomId, first floor only</FormHelperText>
        </Box>
        <HStack>
          <Button type={"submit"} rightIcon={<ArrowForwardIcon />} colorScheme={"blue"} onClick={update}>
            Update
          </Button>
          <Button onClick={disable}>
            <CloseIcon />
          </Button>
        </HStack>
        <img src={"/images/help.png"} />
      </Stack>
    </FormControl>
  )
}
