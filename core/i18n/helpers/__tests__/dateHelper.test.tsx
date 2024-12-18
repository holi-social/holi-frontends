import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'

const language = 'en'

jest.useFakeTimers().setSystemTime(new Date('2022-01-01'))

describe('getRelativeDateString', () => {
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

  it('formats correctly dates from 2-6 days ago', () => {
    for (let daysBefore = 2; daysBefore <= 6; daysBefore++) {
      const date = new Date()
      date.setDate(date.getDate() - daysBefore)
      const dateString = date.toDateString()

      const formattedDateString = getRelativeDateString(dateString, language)

      expect(formattedDateString).toBe(`${daysBefore} days ago`)
    }
  })

  it('formats correctly last weeks date', () => {
    const date = new Date()
    date.setDate(date.getDate() - 7)

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('last week')
  })

  it('formats correctly dates over 1 week ago', () => {
    const date = new Date()
    date.setDate(date.getDate() - 15)

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('2 weeks ago')
  })
})
