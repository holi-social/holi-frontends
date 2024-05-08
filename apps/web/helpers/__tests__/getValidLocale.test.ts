import { getValidLocale } from '@holi/web/helpers/getValidLocale'

describe('getValidLocale', () => {
  it('should recognize de as valid', () => {
    expect(getValidLocale('de')).toEqual('de')
  })

  it('should recognize en as valid', () => {
    expect(getValidLocale('en')).toEqual('en')
  })

  it('should fallback to en for locale "default"', () => {
    expect(getValidLocale('default')).toEqual('en')
  })

  it('should fallback to en for missing locale', () => {
    expect(getValidLocale()).toEqual('en')
  })
})
