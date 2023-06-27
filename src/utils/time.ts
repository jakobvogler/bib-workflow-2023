export function getCentralEuropeanTime() {
  const date = new Date()

  date.setUTCHours(date.getUTCHours() + 1)

  if (isSummertime()) {
    date.setUTCHours(date.getUTCHours() + 1)
  }

  return date
}

export function isSummertime() {
  return true
}
