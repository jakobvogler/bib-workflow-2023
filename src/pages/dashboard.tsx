import {APIService} from "@/client/APIService"
import {isValidToken} from "@/client/token"
import {IUser} from "@/server/models/user"
import {CloseIcon} from "@chakra-ui/icons"
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"

export default function DashboardView() {
  const router = useRouter()
  const toast = useToast()

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
      toast({
        title: "Error loading user",
        position: "top-right",
        status: "error",
        isClosable: true,
      })
    }
  }

  const update = async () => {
    toast({
      id: "update",
      title: "Updating",
      position: "top-right",
      status: "loading",
      isClosable: false,
    })

    try {
      const user = (await APIService.updateUser({libraryIdentifier, libraryPassword, permanentSeat})) as IUser
      setUser(user)
      toast.update("update", {title: "Successs", status: "success"})
    } catch (e: any) {
      toast.update("update", {title: e.body?.error, description: e.body?.message, status: "error"})
    }
  }

  const disable = async () => {
    toast({
      id: "disable",
      title: "Disabling",
      position: "top-right",
      status: "loading",
      isClosable: false,
    })

    try {
      const user = (await APIService.disablePermanentSeat()) as IUser
      setUser(user)
      toast.update("disable", {title: "Successs", status: "success"})
    } catch (e) {
      toast.update("disable", {title: "Error disabling", status: "error"})
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (!isValidToken()) {
      router.push("/login")
    }
  })

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
        <Box w={"fit-content"}>
          {user?.active && <Badge colorScheme="green">active</Badge>}
          {!user?.active && <Badge colorScheme="red">inactive</Badge>}
          <Heading pr={"4"}>Dashboard</Heading>
        </Box>
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
          <Button type={"submit"} colorScheme={"blue"} onClick={update}>
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
