const calculateNumberOfDaysAgo = (date: Date) => {
  const today = new Date()
  const millisecondsPerDay = 1000 * 60 * 60 * 24

  return (today.getTime() - date.getTime()) / millisecondsPerDay
}

/**
 * Relative Date Formatting rules:
 *
 * date === today => “Today”
 * date === yesterday => “Yesterday”
 * date is before yesterday, but within this week => “this week”
 * date is in the last week => “last week”
 * date is more than 1 week ago => “2 weeks ago”, “3 weeks ago” etc.
 *
 * Intl.RelativeTimeFormat docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
 */
export const getRelativeDateString = (dateStr = '', language: string) => {
  const date = new Date(dateStr)
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
