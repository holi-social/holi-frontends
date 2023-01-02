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
  // if no date is provided, return empty string
  if (!dateStr) return ''

  const date = new Date(dateStr)
  let weeksAgo = 0
  let dayOfCurrentWeek = new Date().getDay() - 1
  if (dayOfCurrentWeek < 0) {
    dayOfCurrentWeek = 6
  }
  const daysAgo = Math.floor(calculateNumberOfDaysAgo(date))
  const isNotYesterdayAndBeforeThisWeek = daysAgo > 1 && daysAgo > dayOfCurrentWeek

  if (isNotYesterdayAndBeforeThisWeek) {
    weeksAgo = Math.ceil((daysAgo - dayOfCurrentWeek) / 7)
  }

  return new Intl.RelativeTimeFormat(language, {
    style: 'long',
    numeric: 'auto',
  }).format(isNotYesterdayAndBeforeThisWeek ? -weeksAgo : -daysAgo, isNotYesterdayAndBeforeThisWeek ? 'weeks' : 'days')
}
