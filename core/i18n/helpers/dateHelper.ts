export const getLocale = (language = ''): string => ['en', 'de'].find((lang) => lang === language.split('-')[0]) || 'en'

const calculateNumberOfDaysAgo = (date: Date): number => {
  const today = new Date()
  const millisecondsPerDay = 1000 * 60 * 60 * 24

  return (today.getTime() - date.getTime()) / millisecondsPerDay
}

export const isTargetDate = (date: Date, dayFromNow = 0): boolean => {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + dayFromNow)

  return (
    date.getDate() === targetDate.getDate() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  )
}

export const isToday = (date: Date): boolean => isTargetDate(date)
export const isYesterday = (date: Date): boolean => isTargetDate(date, -1)

/**
 * @name getTimeFormat
 * @param timestampOrDateStr - timestapm or stringified date
 * @param locale - user locale (e.g. "en", "de", etc)
 * @returns - time formated `HH:mm`
 */
export const getTimeFormat = (locale: string, timestampOrDateStr?: number | string): string => {
  if (timestampOrDateStr == undefined) return ''

  return new Intl.DateTimeFormat(getLocale(locale), {
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(timestampOrDateStr))
}

/**
 * @description getDisplayDate() function
 *
 * @param timestampOrDateStr - timestapm or stringified date
 * @param locale - user locale (e.g. "en", "de", etc)
 *
 * @returns A formated date string for:
 * - today: time (e.g. 12:34)
 * - yesterday: localized "yesterday" (e.g. "gestern")
 * - for other dates: formated nummeric date (e.g. 24/12/2022)
 */
export const getDisplayDate = (locale: string, timestampOrDateStr?: number | string): string => {
  if (timestampOrDateStr == undefined) return ''

  locale = getLocale(locale)
  const date = new Date(timestampOrDateStr)

  if (isToday(date)) {
    return getTimeFormat(locale, timestampOrDateStr)
  } else if (isYesterday(date)) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day')
  } else {
    return Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date)
  }
}

/**
 * Relative Date Formatting rules:
 *
 * date === today => "Today"
 * date === yesterday => "Yesterday"
 * date is 2-6 days ago => "2 days ago", "3 days ago" etc.
 * date is in the last week => "last week"
 * date is more than 1 week ago => "2 weeks ago", "3 weeks ago" etc.
 *
 * Intl.RelativeTimeFormat docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
 */
export const getRelativeDateString = (dateStr: string | undefined = '', locale: string): string => {
  // if no date is provided, return empty string
  if (!dateStr) return ''

  locale = getLocale(locale)

  const date = new Date(dateStr)
  const daysAgo = Math.floor(calculateNumberOfDaysAgo(date))

  // For dates more than 6 days ago, show weeks
  if (daysAgo > 6) {
    const weeksAgo = Math.ceil(daysAgo / 7)
    return new Intl.RelativeTimeFormat(locale, {
      style: 'long',
      numeric: 'auto',
    }).format(-weeksAgo, 'weeks')
  }

  // For dates within last 6 days, show exact days
  return new Intl.RelativeTimeFormat(locale, {
    style: 'long',
    numeric: 'auto',
  }).format(-daysAgo, 'days')
}

export const getFormattedDate = (date: string | undefined, locale: string) => {
  if (!date) return ''
  // converting given timestamp to a date first (with '00:00:00' as time)
  // to show the real days instead of exact timestamp calculations
  const dateWithoutTime = new Date(date).toDateString()
  const dateString = getRelativeDateString(dateWithoutTime, locale)
  return dateString.charAt(0).toUpperCase() + dateString.slice(1)
}

export const getFormattedDateAbs = (date: string | undefined, locale: string) => {
  if (!date) return ''
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}
