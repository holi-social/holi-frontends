import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'

const language = 'en'

describe('formats date strings to relative date strings correctly', () => {
  it('returns empty string if no dateStr is given', () => {
    const formattedDateString = getRelativeDateString(undefined, language)

    expect(formattedDateString).toBe('')
  })

  it('formats correctly todays date', () => {
    const date = new Date()
    const dateString = date.toDateString()
    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('today')
  })

  it('formats correctly yesterdays date', () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('yesterday')
  })

  it.skip('formats correctly this weeks date', () => {
    const date = new Date()
    let dayOfWeek = date.getDay() - 1
    if (dayOfWeek < 0) {
      dayOfWeek = 6
    }
    date.setDate(date.getDate() - 2) // set this date to day before yesterday

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    // `dayOfWeek - 2` checks if day before yesterday is in current week
    expect(formattedDateString).toBe(dayOfWeek - 2 >= 0 ? '2 days ago' : 'last week')
  })

  it('formats correctly last weeks date', () => {
    const date = new Date()
    date.setDate(date.getDate() - 7)

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('last week')
  })

  it('formats correctly over 2 weeks ago date', () => {
    const date = new Date()
    date.setDate(date.getDate() - 15)

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('2 weeks ago')
  })
})
