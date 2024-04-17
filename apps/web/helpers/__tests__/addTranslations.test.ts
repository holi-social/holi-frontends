import { Ni18nOptions } from 'ni18n'

import { addTranslations } from '@holi/web/helpers/addTranslations'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

const mockLoadTranslations = jest.fn()

jest.mock('ni18n', () => ({
  loadTranslations: (config: Ni18nOptions, locale: string, ns: string[]) => mockLoadTranslations(config, locale, ns),
}))

describe('addTranslations', () => {
  it('should add translations to page props', async () => {
    const mockedTranslations = { i18n: { key: 'value' } }
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    const existingProps = { foo: 'bar' }
    const props = await addTranslations('en', existingProps)

    expect(props).toEqual({
      foo: 'bar',
      ...mockedTranslations,
    })
  })

  it('should pass correct paramters to load translations', async () => {
    await addTranslations('en', {})

    expect(mockLoadTranslations).toHaveBeenCalledWith(ni18nConfig, 'en', ni18nConfig.ns)
  })
})
