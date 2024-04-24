import { appendLocaleSubPaths } from '@holi/mobile/navigation/helpers/appendLocaleSubPaths'

jest.mock('@holi/core/i18n/locales.cjs', () => ({
  locales: ['en', 'de'],
}))

describe('appendLocaleSubPath', () => {
  it('should expand prefixes for all locales', () => {
    const prefixes = ['holi://', 'https://app.holi.social']
    const result = appendLocaleSubPaths(prefixes)
    const expectedPrefixes = [
      'holi:///en',
      'https://app.holi.social/en',
      'holi:///de',
      'https://app.holi.social/de',
      'holi://',
      'https://app.holi.social',
    ]

    expect(result).toEqual(expectedPrefixes)
  })
})
