import {ArrowForwardIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  ChakraProvider,
  Code,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Stack,
} from "@chakra-ui/react"
import getConfig from "next/config"
import Head from "next/head"
import {useEffect, useState} from "react"

const {publicRuntimeConfig} = getConfig()

export default function Home() {
  const [token, setToken] = useState<string>()
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      localStorage.setItem("loggedInBefore", "yes")
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  return (
    <>
      <Head>
        <title>CMD Todos</title>
        <meta name="description" content="Mange your todos in a light-weight environment." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ChakraProvider>
          {token ? (
            <Stack>
              <Code whiteSpace={"pre"}>{output}</Code>
              <HStack>
                <InputGroup>
                  <InputLeftAddon>todo</InputLeftAddon>
                  <Input
                    placeholder="press enter"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                </InputGroup>
                <Button colorScheme={"gray"} onClick={() => setToken(undefined)}>
                  log out
                </Button>
              </HStack>
            </Stack>
          ) : (
            <Stack justifyContent={"center"} alignItems={"center"}>
              <LoginSignup setToken={setToken} />
            </Stack>
          )}
        </ChakraProvider>
      </main>
    </>
  )
}

Home.getInitialProps = async () => {
  return {}
}

const LoginSignup = ({setToken}: {setToken: Function}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordRepeat, setPasswordRepeat] = useState<string>("")

  const login = async () => {
    const response = await fetch(`${publicRuntimeConfig.OWN_URL}/api/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({username, password}),
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    setToken(out.token)
  }
  const signup = async () => {
    const response = await fetch(`${publicRuntimeConfig.OWN_URL}/api/signup`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({username, password}),
    })

    const out = await response.json()
    if (out.error) {
      alert(out.error + (out.message ? `: ${out.message}` : ""))
      return
    }

    setIsLogin(true)
  }

  useEffect(() => {
    const loggedInBefore = localStorage.getItem("loggedInBefore")
    if (loggedInBefore) {
      setIsLogin(true)
    }
  }, [])

  const usernameInvalid = !!username && !/^([a-zA-Z0-9]{4,32})$/.test(username)
  const passwordInvalid = !!password && !/^([a-zA-Z0-9]{8,64})$/.test(password)
  const passwordRepeatInvalid = password !== passwordRepeat

  return (
    <FormControl isRequired>
      <Stack maxW={"80"} spacing={"4"}>
        <Heading>{isLogin ? "Login" : "Sign Up"}</Heading>
        <Box>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder={"choose a username"}
            value={username}
            isInvalid={usernameInvalid}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box>
          <FormLabel>Password</FormLabel>
          <Input
            type={"password"}
            placeholder={"choose a password"}
            value={password}
            isInvalid={passwordInvalid}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isLogin && login()}
          />
        </Box>
        {!isLogin && (
          <Box>
            <FormLabel>Password Repeat</FormLabel>
            <Input
              type={"password"}
              placeholder={"Password Repeat"}
              value={passwordRepeat}
              isInvalid={passwordRepeatInvalid}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signup()}
            />
          </Box>
        )}
        <Link w={"fit-content"} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "sign up?" : "login?"}
        </Link>
        <Button
          type={"submit"}
          rightIcon={<ArrowForwardIcon />}
          colorScheme={"blue"}
          onClick={() => (isLogin ? login() : signup())}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>
      </Stack>
    </FormControl>
  )
}
