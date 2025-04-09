/**
 * Normalize the date to end of day, to avoid issues by time comparison
 * @param date - date to normalize
 * @returns normalized date
 */
export const normalizeDate = (date: Date): Date => {
  const newDate = new Date(date)
  newDate.setHours(23, 59, 59, 0)
  return newDate
}

/**
 * Get today's date normalized to end of day
 * @returns today's date normalized to end of day
 */
export const getTodayDate = (): Date => {
  return normalizeDate(new Date())
}

/**
 * Get one day later date
 * @param date - date to get one day later
 * @returns one day later date
 */
export const getOneDayLaterDate = (date: Date) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + 1)
  return newDate
}

/**
 * Get one day earlier date
 * @param date - date to get one day earlier
 * @returns one day earlier date
 */
export const getOneDayEarlierDate = (date: Date): Date => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() - 1)
  return newDate
}
