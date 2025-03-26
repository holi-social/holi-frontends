import { useTranslation } from 'react-i18next'

export const useFormattedEventDates = (startDate?: string, endDate?: string) => {
  const { t, i18n } = useTranslation()

  if (!startDate) {
    return undefined
  }
  const startDateObj = new Date(startDate)
  const endDateObj = endDate ? new Date(endDate) : undefined

  const startDay = startDateObj.getDate()
  const startWeekday = startDateObj.toLocaleDateString(i18n.language, { weekday: 'short' })
  const startMonthName = startDateObj.toLocaleDateString(i18n.language, { month: 'short' })
  const startTime = startDateObj.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })

  if (!endDateObj || startDateObj?.getTime() === endDateObj?.getTime()) {
    return startTime === '00:00' || startTime === '12:00 AM'
      ? `${startWeekday}, ${startDay} ${startMonthName}`
      : `${startWeekday}, ${startDay} ${startMonthName} ∙ ${startTime}`
  }

  const endDay = endDateObj.getDate()
  const endWeekday = endDateObj.toLocaleDateString(i18n.language, { weekday: 'short' })
  const endMonthName = endDateObj.toLocaleDateString(i18n.language, { month: 'short' })
  const endTime = endDateObj.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })

  if (startDay !== endDay) {
    return `${startWeekday}, ${startDay} ${startMonthName} ${t('act.events.fromTo')} ${endWeekday}, ${endDay} ${endMonthName}`
  }

  return `${startWeekday}, ${startDay} ${startMonthName} ∙ ${startTime} ${t('act.events.fromTo')} ${endTime}`
}
