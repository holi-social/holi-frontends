import { useTranslation } from 'react-i18next'

export const useFormattedCardDates = (startDate?: Date, endDate?: Date) => {
  const { i18n } = useTranslation()

  if (!startDate) return undefined

  const startDay = String(startDate.getDate()).padStart(2, '0')
  const startWeekday = startDate.toLocaleDateString(i18n.language, { weekday: 'short' })
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
  const startTime = startDate.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })

  if (!endDate || startDate?.getTime() === endDate?.getTime()) {
    return startTime === '00:00' || startTime === '12:00 AM'
      ? `${startWeekday}, ${startDay}.${startMonth}.`
      : `${startWeekday}, ${startDay}.${startMonth}. ∙ ${startTime}`
  }

  const endDay = String(endDate.getDate()).padStart(2, '0')
  const endWeekday = endDate.toLocaleDateString(i18n.language, { weekday: 'short' })
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
  const endTime = endDate.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })

  if (startDay !== endDay) {
    return `${startWeekday}, ${startDay}.${startMonth}. - ${endWeekday}, ${endDay}.${endMonth}.`
  }

  return `${startWeekday}, ${startDay}.${startMonth}. ∙ ${startTime} - ${endTime}`
}
