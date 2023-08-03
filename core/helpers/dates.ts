export const isThisWeek = (date: Date | string) => {
  const givenDate = new Date(date)
  const currentDate = new Date()

  // Calculate the start of the current week (Sunday)
  const currentWeekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  )

  // Calculate the start of the week for the input date
  const weekStartDate = new Date(
    givenDate.getFullYear(),
    givenDate.getMonth(),
    givenDate.getDate() - givenDate.getDay()
  )

  // Compare if the start of the week for the input date is either the same as the start of the current week,
  // or if it falls within the current week (within 7 days from the start of the current week)
  return (
    weekStartDate.getTime() === currentWeekStart.getTime() ||
    (weekStartDate > currentWeekStart && weekStartDate.getTime() < currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
  )
}

export const isLastWeek = (date: Date | string) => {
  const givenDate = new Date(date)
  const currentDate = new Date()

  // Calculate the start of the current week (Sunday)
  const currentWeekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  )

  // Calculate the start of the previous week (Sunday)
  const previousWeekStart = new Date(
    currentWeekStart.getFullYear(),
    currentWeekStart.getMonth(),
    currentWeekStart.getDate() - 7
  )

  // Calculate the start of the week for the input date
  const weekStartDate = new Date(
    givenDate.getFullYear(),
    givenDate.getMonth(),
    givenDate.getDate() - givenDate.getDay()
  )

  // Check if the start of the week for the input date falls within the previous week
  return weekStartDate >= previousWeekStart && weekStartDate < currentWeekStart
}
