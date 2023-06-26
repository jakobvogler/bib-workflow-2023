export function getCentralEuropeanTime() {
  const date = new Date()

  date.setUTCDate(date.getUTCDate() + 1)

  if (isSummertime()) {
    date.setUTCDate(date.getUTCDate() + 1)
  }

  return date
}

export function isSummertime() {
  return true
}
