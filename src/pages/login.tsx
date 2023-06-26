import {ArrowForwardIcon} from "@chakra-ui/icons"
import {Box, Button, FormControl, FormLabel, Heading, Input, Link, Stack} from "@chakra-ui/react"
import getConfig from "next/config"
import {useRouter} from "next/router"
import {useState} from "react"

const {publicRuntimeConfig} = getConfig()

export default function LoginView() {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const login = async () => {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({email, password}),
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    localStorage.setItem("token", out.token)
    router.push("/dashboard")
  }

  return (
    <FormControl isRequired>
      <Stack maxW={"80"} spacing={"4"}>
        <Heading>Login</Heading>
        <Box>
          <FormLabel>Email</FormLabel>
          <Input type={"email"} placeholder={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Box>
        <Box>
          <FormLabel>Password</FormLabel>
          <Input
            type={"password"}
            placeholder={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
        </Box>
        <Link w={"fit-content"} href={"/signup"}>
          sign up?
        </Link>
        <Button type={"submit"} rightIcon={<ArrowForwardIcon />} colorScheme={"blue"} onClick={login}>
          Login
        </Button>
      </Stack>
    </FormControl>
  )
}
