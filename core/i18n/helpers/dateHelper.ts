const calculateNumberOfDaysAgo = (date: Date) => {
  const today = new Date()
  const millisecondsPerDay = 1000 * 60 * 60 * 24

  return (today.getTime() - date.getTime()) / millisecondsPerDay
}

/**
 * Date Formatting rules:
 *
 * If date === today, it shows “Today”
 * If date === yesterday, it shows “Yesterday”
 * If date is before yesterday, but within this week, it shows “this week”
 * If date is in the last week, it shows “last week”
 * If date is more than 1 week ago, the respective number of weeks that past since creation is shown: “2 weeks ago, “3 weeks ago” etc.
 *
 * Intl.RelativeTimeFormat docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
 */
export const getFormattedDateString = (date: Date, language: string) => {
  let weeksAgo = 0
  const daysAgo = Math.floor(calculateNumberOfDaysAgo(date))
  const isOverOneDayAgo = daysAgo > 1

  if (isOverOneDayAgo) {
    weeksAgo = Math.floor(daysAgo / 7)
  }
  return new Intl.RelativeTimeFormat(language, {
    style: 'long',
    numeric: 'auto',
  }).format(isOverOneDayAgo ? -weeksAgo : -daysAgo, isOverOneDayAgo ? 'weeks' : 'days')
}
