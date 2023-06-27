import {ArrowForwardIcon} from "@chakra-ui/icons"
import {Box, Button, FormControl, FormLabel, Heading, Input, Link, Stack} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {useState} from "react"

export default function SignupView() {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordRepeat, setPasswordRepeat] = useState<string>("")
  const [code, setCode] = useState<string>("")

  const signup = async () => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({email, password, code}),
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    router.push("/login")
  }

  const passwordRepeatInvalid = password !== passwordRepeat

  return (
    <FormControl isRequired>
      <Stack maxW={"80"} spacing={"4"}>
        <Heading>Sign Up</Heading>
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
          />
        </Box>
        <Box>
          <FormLabel>Password Repeat</FormLabel>
          <Input
            type={"password"}
            placeholder={"password repeat"}
            value={passwordRepeat}
            isInvalid={passwordRepeatInvalid}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
        </Box>
        <Box>
          <FormLabel>Invite Code</FormLabel>
          <Input
            placeholder={"code"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signup()}
          />
        </Box>
        <Link w={"fit-content"} href={"/login"}>
          login?
        </Link>
        <Button type={"submit"} rightIcon={<ArrowForwardIcon />} colorScheme={"blue"} onClick={signup}>
          Sign Up
        </Button>
      </Stack>
    </FormControl>
  )
}
