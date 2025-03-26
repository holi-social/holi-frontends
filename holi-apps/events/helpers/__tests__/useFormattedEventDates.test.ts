import { renderHook } from '@testing-library/react-native'
import { useFormattedEventDates } from '@holi-apps/events/helpers/useFormattedEventDates'

jest.mock('react-i18next', () => {
  const mockTranslations = {
    en: { 'act.events.fromTo': 'to' },
    de: { 'act.events.fromTo': 'bis' },
  }

  return {
    useTranslation: () => ({
      i18n: {
        language: 'en', // Default to English
        changeLanguage: jest.fn(),
        exists: () => true,
      },
      t: (key: keyof (typeof mockTranslations)['en']) => mockTranslations['en'][key] || key,
    }),
  }
})

describe.skip('useFormattedEventDates', () => {
  beforeEach(() => {
    jest.resetModules() // Ensures fresh module state for each test
  })
  it('should return correctly formatted date if no start date is passed', async () => {
    const startDate = undefined
    const endDate = '2025-03-26T13:00:00+01:00'

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual(undefined)
  })
  it('should return correctly formatted date if empty start date is passed', async () => {
    const startDate = ''
    const endDate = '2025-03-26T13:00:00+01:00'

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual(undefined)
  })
  it('should return correctly formatted date if no end date is passed', async () => {
    const startDate = '2025-03-26T13:00:00+01:00'
    const endDate = undefined

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual('Wed, 26 Mar ∙ 01:00 PM')
  })
  it('should return correctly formatted date if start date and end date are the same', async () => {
    const startDate = '2025-03-26T13:00:00+01:00'
    const endDate = '2025-03-26T13:00:00+01:00'

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual('Wed, 26 Mar ∙ 01:00 PM')
  })
  it('should return correctly formatted date if start date and end date are both 00:00', async () => {
    const startDate = '2025-03-26T00:00:00+01:00'
    const endDate = '2025-03-26T00:00:00+01:00'

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual('Wed, 26 Mar')
  })
  it('should return correctly formatted date if the event lasts multiple days', async () => {
    const startDate = '2025-03-26T13:00:00+01:00'
    const endDate = '2025-03-27T10:00:00+01:00'

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual('Wed, 26 Mar to Thu, 27 Mar')
  })
  it('should return correctly formatted date in any other case', async () => {
    const startDate = '2025-03-26T13:00:00+01:00'
    const endDate = '2025-03-26T18:00:00+01:00'

    const { result } = renderHook(() => useFormattedEventDates(startDate, endDate))

    expect(result.current).toEqual('Wed, 26 Mar ∙ 01:00 PM to 06:00 PM')
  })
  it('should return correctly formatted date in German', () => {
    jest.doMock('react-i18next', () => {
      const mockTranslations = {
        en: { 'act.events.fromTo': 'to' },
        de: { 'act.events.fromTo': 'bis' },
      }

      return {
        useTranslation: () => ({
          i18n: {
            language: 'de',
            changeLanguage: jest.fn(),
            exists: () => true,
          },
          t: (key: keyof (typeof mockTranslations)['de']) => mockTranslations['de'][key] || key,
        }),
      }
    })

    jest.resetModules()
    const { useFormattedEventDates } = require('@holi-apps/events/helpers/useFormattedEventDates')

    const { result } = renderHook(() =>
      useFormattedEventDates('2025-03-26T13:00:00+01:00', '2025-03-27T10:00:00+01:00')
    )

    // Expect "to" to be translated as "bis"
    expect(result.current).toEqual('Mi, 26 Mär bis Do, 27 Mär')
  })
})
