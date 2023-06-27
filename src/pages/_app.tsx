import {ChakraProvider} from "@chakra-ui/react"
import type {AppProps} from "next/app"
import Head from "next/head"

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>Library Service</title>
        <meta name="description" content="Get a seat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </main>
    </>
  )
}
