import { renderHook } from '@testing-library/react-native'
import { useFormattedCardDates } from 'holi-bricks/components/compactCard/helpers/useFormattedCardDates'

jest.mock('react-i18next', () => {
  return {
    useTranslation: () => ({
      i18n: {
        language: 'en',
        changeLanguage: jest.fn(),
        exists: () => true,
      },
    }),
  }
})

describe.skip('useFormattedCardDates', () => {
  beforeEach(() => {
    jest.resetModules()
  })
  it('should return correctly formatted date if no start date is passed', async () => {
    const { result } = renderHook(
      () => useFormattedCardDates(undefined, new Date(Date.UTC(2025, 2, 26, 12, 0))) // 13:00 CET
    )
    expect(result.current).toEqual(undefined)
  })

  it('should return correctly formatted date if no end date is passed', async () => {
    const { result } = renderHook(
      () => useFormattedCardDates(new Date(Date.UTC(2025, 2, 26, 12, 0)), undefined) // 13:00 CET
    )
    expect(result.current).toEqual('Wed, 26.03. ∙ 01:00 PM')
  })

  it('should return correctly formatted date if start date and end date are the same', async () => {
    const start = new Date(Date.UTC(2025, 2, 26, 12, 0)) // 13:00 CET
    const { result } = renderHook(() => useFormattedCardDates(start, start))
    expect(result.current).toEqual('Wed, 26.03. ∙ 01:00 PM')
  })

  it('should return correctly formatted date if start date and end date are both 00:00', async () => {
    const midnight = new Date(Date.UTC(2025, 2, 25, 23, 0)) // 00:00 CET on 26th
    const { result } = renderHook(() => useFormattedCardDates(midnight, midnight))
    expect(result.current).toEqual('Wed, 26.03.')
  })

  it('should return correctly formatted date if the event lasts multiple days', async () => {
    const start = new Date(Date.UTC(2025, 2, 26, 12, 0)) // 13:00 CET
    const end = new Date(Date.UTC(2025, 2, 27, 9, 0)) // 10:00 CET
    const { result } = renderHook(() => useFormattedCardDates(start, end))
    expect(result.current).toEqual('Wed, 26.03. - Thu, 27.03.')
  })

  it('should return correctly formatted date in English for other cases', async () => {
    const start = new Date(Date.UTC(2025, 2, 26, 12, 0)) // 13:00 CET
    const end = new Date(Date.UTC(2025, 2, 26, 17, 0)) // 18:00 CET
    const { result } = renderHook(() => useFormattedCardDates(start, end))
    expect(result.current).toEqual('Wed, 26.03. ∙ 01:00 PM - 06:00 PM')
  })

  it('should return correctly formatted date in German', async () => {
    jest.mock('react-i18next', () => {
      return {
        useTranslation: () => ({
          i18n: {
            language: 'de', // Switch to German
            changeLanguage: jest.fn(),
            exists: () => true,
          },
        }),
      }
    })

    const { useFormattedCardDates } = require('holi-bricks/components/compactCard/helpers/useFormattedCardDates')
    const start = new Date(Date.UTC(2025, 2, 26, 12, 0)) // 13:00 CET
    const end = new Date(Date.UTC(2025, 2, 27, 9, 0)) // 10:00 CET
    const { result } = renderHook(() => useFormattedCardDates(start, end))
    expect(result.current).toEqual('Mi, 26.03. - Do, 27.03.')
  })
})
