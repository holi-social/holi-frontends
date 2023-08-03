import { isLastWeek, isThisWeek } from '@holi/core/helpers/dates'

const currentDate = new Date()

// Calculate the start of the current week (Sunday)
const currentWeekStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - currentDate.getDay()
)

describe('isThisWeek', () => {
  it('should correctly identify dates within the current week', () => {
    expect(isThisWeek(currentWeekStart)).toBe(true)

    const withinWeekDate = new Date(currentWeekStart)
    withinWeekDate.setDate(withinWeekDate.getDate() + 3) // Within 3 days from the current week start
    expect(isThisWeek(withinWeekDate)).toBe(true)
  })

  it('should correctly identify dates outside the current week', () => {
    const lastWeekDate = new Date()
    lastWeekDate.setDate(lastWeekDate.getDate() - 8) // More than 7 days before the current week start
    expect(isThisWeek(lastWeekDate)).toBe(false)

    const nextWeekDate = new Date()
    nextWeekDate.setDate(nextWeekDate.getDate() + 8) // More than 7 days after the current week start
    expect(isThisWeek(nextWeekDate)).toBe(false)
  })
})

describe('isLastWeek', () => {
  it('should correctly identify dates from last week', () => {
    const firstDayOfLastWeek = new Date(currentWeekStart)
    firstDayOfLastWeek.setDate(currentWeekStart.getDate() - 7)

    const lastDayOfLastWeek = new Date(currentWeekStart)
    lastDayOfLastWeek.setDate(currentWeekStart.getDate() - 1)

    expect(isLastWeek(firstDayOfLastWeek)).toBe(true)
    expect(isLastWeek(lastDayOfLastWeek)).toBe(true)
  })

  it('should correctly identify dates outside last week', () => {
    const moreThanAWeekAgo = new Date(currentWeekStart)
    moreThanAWeekAgo.setDate(currentWeekStart.getDate() - 8)

    const thisWeek = new Date(currentWeekStart)
    thisWeek.setDate(currentWeekStart.getDate() + 1)

    expect(isLastWeek(thisWeek)).toBe(false)
    expect(isLastWeek(moreThanAWeekAgo)).toBe(false)
  })
})
