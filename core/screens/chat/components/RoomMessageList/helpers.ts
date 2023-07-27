import { getLocale, isToday, isYesterday } from '@holi/core/i18n/helpers/dateHelper'

export const getSectionDisplayDate = (locale: string, dateStr?: string): string => {
  if (!dateStr) return ''

  locale = getLocale(locale)

  const date = new Date(dateStr)

  if (isToday(date)) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day')
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
