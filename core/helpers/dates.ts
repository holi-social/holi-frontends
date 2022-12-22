export const isThisWeek = (date: Date | string) => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const numDay = now.getDate()

  const start = new Date(now)
  start.setDate(numDay - dayOfWeek)
  start.setHours(0, 0, 0, 0)

  return new Date(date) >= start && new Date(date) <= now
}

export const isLastWeek = (date: Date | string) => {
  const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7))
  const dayOfWeek = lastWeek.getDay()
  const numDay = lastWeek.getDate()

  const start = new Date(lastWeek)
  start.setDate(numDay - dayOfWeek)
  start.setHours(0, 0, 0, 0)

  const end = new Date(lastWeek)
  end.setDate(numDay + (7 - dayOfWeek))
  end.setHours(0, 0, 0, 0)

  return new Date(date) >= start && new Date(date) <= end
}
