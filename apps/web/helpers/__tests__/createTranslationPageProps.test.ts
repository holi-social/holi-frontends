import { Ni18nOptions } from 'ni18n'

import { createTranslationPageProps } from '@holi/web/helpers/createTranslationPageProps'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

const mockLoadTranslations = jest.fn()

jest.mock('ni18n', () => ({
  loadTranslations: (config: Ni18nOptions, locale: string, ns: string[]) => mockLoadTranslations(config, locale, ns),
}))

describe('createTranslationPageProps', () => {
  it('should create page props for translations', async () => {
    const mockedTranslations = { i18n: { key: 'value' } }
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    const props = await createTranslationPageProps('en')

    expect(props).toEqual(mockedTranslations)
  })

  it('should pass correct paramters to load translations', async () => {
    await createTranslationPageProps('en')

    expect(mockLoadTranslations).toHaveBeenCalledWith(ni18nConfig, 'en', ni18nConfig.ns)
  })
})
