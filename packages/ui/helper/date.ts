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

export const numberToStringWithPad = (num: number) => {
  // Convert the number to a string
  let numStr: string = num.toString()

  // Check if the number is a single character long
  if (numStr.length === 1) {
    // Add a zero before the number
    numStr = '0' + numStr
  }

  return numStr
}

export const transformToUTC = (dateString: string) => {
  const date = new Date(dateString)

  // Get individual date components
  const year = date.getUTCFullYear()
  const month = `0${date.getUTCMonth() + 1}`.slice(-2)
  const day = `0${date.getUTCDate()}`.slice(-2)
  const hours = `0${date.getUTCHours()}`.slice(-2)
  const minutes = `0${date.getUTCMinutes()}`.slice(-2)
  const seconds = `0${date.getUTCSeconds()}`.slice(-2)
  const milliseconds = `00${date.getUTCMilliseconds()}`.slice(-3)

  // Construct the UTC formatted string
  const utcString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`

  return utcString
}
