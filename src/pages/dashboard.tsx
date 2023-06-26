import {ArrowForwardIcon} from "@chakra-ui/icons"
import {Box, Button, FormControl, FormHelperText, FormLabel, Heading, Input, Stack} from "@chakra-ui/react"
import getConfig from "next/config"
import {useRouter} from "next/router"
import {useState} from "react"

const {publicRuntimeConfig} = getConfig()

export default function SignupView() {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordRepeat, setPasswordRepeat] = useState<string>("")

  const getUser = async () => {
    const response = await fetch(`/api/user`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    router.push("/login")
  }

  return (
    <FormControl isRequired>
      <Stack maxW={"80"} spacing={"4"}>
        <Heading>Sign Up</Heading>
        <Box>
          <FormLabel>Library Identifier</FormLabel>
          <FormHelperText>Please use the library number, not the student number</FormHelperText>
          <Input placeholder={"identifier"} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Box>
        <Box>
          <FormLabel>Library Password</FormLabel>
          <Input
            type={"password"}
            placeholder={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Button type={"submit"} rightIcon={<ArrowForwardIcon />} colorScheme={"blue"} onClick={signup}>
          Update
        </Button>
      </Stack>
    </FormControl>
  )
}
