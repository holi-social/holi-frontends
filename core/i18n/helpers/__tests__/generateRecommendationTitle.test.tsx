import generateRecommendationTitle from '@holi/core/i18n/helpers/generateRecommendationTitle'
import { TFunction } from 'i18next'

describe('generateRecommendationTitle', () => {
  it('returns correct possessive form for English', () => {
    const name = 'Rubia'
    const numRecommendations = 1
    const currentLanguage = 'en'
    const t = jest.fn().mockReturnValue("Rubia's") as unknown as TFunction
    const result = generateRecommendationTitle({ name, numRecommendations, currentLanguage, t })
    expect(result).toEqual("Rubia's")
  })

  it('returns correct possessive form for German', () => {
    const name = 'Rubia'
    const numRecommendations = 1
    const currentLanguage = 'de'
    const t = jest.fn().mockReturnValue('Rubias') as unknown as TFunction
    const result = generateRecommendationTitle({ name, numRecommendations, currentLanguage, t })
    expect(result).toEqual('Rubias')
  })

  it('returns correct possessive form for English if ending in [s, ß, z, x]', () => {
    const name = 'Max'
    const numRecommendations = 1
    const currentLanguage = 'en'
    const t = jest.fn().mockReturnValue("Max'") as unknown as TFunction
    const result = generateRecommendationTitle({ name, numRecommendations, currentLanguage, t })
    expect(result).toEqual("Max'")
  })

  it('returns correct possessive form for German if ending in [s, ß, z, x]', () => {
    const name = 'Max'
    const numRecommendations = 1
    const currentLanguage = 'de'
    const t = jest.fn().mockReturnValue("Max'") as unknown as TFunction
    const result = generateRecommendationTitle({ name, numRecommendations, currentLanguage, t })
    expect(result).toEqual("Max'")
  })
})
