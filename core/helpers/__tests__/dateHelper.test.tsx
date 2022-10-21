import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'

const language = 'en'

describe('formats date strings to relative date strings correctly', () => {
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

  it('formats correctly this weeks date', () => {
    const date = new Date()
    date.setDate(date.getDate() - 2)

    const dateString = date.toDateString()

    const formattedDateString = getRelativeDateString(dateString, language)

    expect(formattedDateString).toBe('this week')
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
