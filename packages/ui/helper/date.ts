// formats date to yyyy-mm-dd
export function formatDateToYYYMMDD(date: Date) {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-')
}

export const localizeDate = (
  date: Date,
  language: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  onlyTime = false
) => {
  const result = date.toLocaleDateString(language, options)
  if (onlyTime) {
    return result.split(' ')[1]
  }
  return result
}
