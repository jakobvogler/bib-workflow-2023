export async function wait(ms?: number) {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}
