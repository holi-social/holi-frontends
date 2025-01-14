import generatePostTitle from '@holi/core/i18n/helpers/generatePostTitle'
import { TFunction } from 'i18next'

describe('generatePostTitle', () => {
  it('returns correct post title for English', () => {
    const name = 'Rubia'
    const currentLanguage = 'en'
    const t = jest.fn().mockReturnValue("Rubia's post") as unknown as TFunction
    const result = generatePostTitle({ name, currentLanguage, t })
    expect(result).toEqual("Rubia's post")
  })

  it('returns correct post title for German', () => {
    const name = 'Rubia'
    const currentLanguage = 'de'
    const t = jest.fn().mockReturnValue('Rubias post') as unknown as TFunction
    const result = generatePostTitle({ name, currentLanguage, t })
    expect(result).toEqual('Rubias post')
  })

  it('returns correct post title for English if ending in [s, ß, z, x]', () => {
    const name = 'Max'
    const currentLanguage = 'en'
    const t = jest.fn().mockReturnValue("Max' post") as unknown as TFunction
    const result = generatePostTitle({ name, currentLanguage, t })
    expect(result).toEqual("Max' post")
  })

  it('returns correct post title for German if ending in [s, ß, z, x]', () => {
    const name = 'Max'
    const currentLanguage = 'de'
    const t = jest.fn().mockReturnValue("Max' post") as unknown as TFunction
    const result = generatePostTitle({ name, currentLanguage, t })
    expect(result).toEqual("Max' post")
  })
})
