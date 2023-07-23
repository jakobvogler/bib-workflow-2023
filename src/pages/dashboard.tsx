import {APIService} from "@/client/APIService"
import {isValidToken} from "@/client/token"
import AdminView from "@/components/AdminView"
import {IUser} from "@/server/models/user"
import {CloseIcon} from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {useEffect, useRef, useState} from "react"

export default function DashboardView() {
  const router = useRouter()
  const toast = useToast()

  const [token, setToken] = useState<string>("")
  const [user, setUser] = useState<IUser>()

  const [libraryIdentifier, setLibraryIdentifier] = useState<string>("")
  const [libraryPassword, setLibraryPassword] = useState<string>("")
  const [permanentSeat, setPermanentSeat] = useState<string>("")
  const [mergeReserve, setMergeReserve] = useState<boolean>()

  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef<any>()
  const [reserveDate, setReserveDate] = useState<Date>(new Date())

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
      const user = (await APIService.updateUser({
        libraryIdentifier,
        libraryPassword,
        permanentSeat,
        mergeReserve,
      })) as IUser
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

  const reserveNow = async () => {
    toast({
      id: "reserveNow",
      title: "Reserving",
      position: "top-right",
      status: "loading",
      isClosable: false,
    })

    try {
      await APIService.reservePermanentSeat({reserveDate})
      toast.update("reserveNow", {title: "Successs", status: "success"})
    } catch (e: any) {
      toast.update("reserveNow", {title: e.body?.error, description: e.body?.message, status: "error"})
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
    setMergeReserve(user.mergeReserve)
  }, [user])

  return (
    <>
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
            <Input placeholder={"e.g. 704"} value={permanentSeat} onChange={(e) => setPermanentSeat(e.target.value)} />
            <FormHelperText>Please put here the roomId, first floor only</FormHelperText>
          </Box>
          <Box>
            <FormLabel>Merge Timeslots</FormLabel>
            <HStack>
              <FormHelperText>Whether morning and midday should be reserved as one reservation</FormHelperText>
              <Switch isChecked={mergeReserve} onChange={(e) => setMergeReserve(!mergeReserve)} />
            </HStack>
          </Box>
          <HStack>
            <Button type={"submit"} colorScheme={"blue"} onClick={update}>
              Update
            </Button>
            <Button onClick={disable}>
              <CloseIcon />
            </Button>
            <Button colorScheme={"purple"} onClick={onOpen}>
              Reserve Now
            </Button>
          </HStack>
          {user?.admin && <AdminView />}
          <img src={"/images/help.png"} />
        </Stack>
      </FormControl>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Select Date
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                type={"date"}
                value={reserveDate?.toISOString().slice(0, 10)}
                onChange={(e) => setReserveDate(new Date(e.target.value))}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={() => {
                  onClose()
                  reserveNow()
                }}
                ml={3}
              >
                Reserve
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
