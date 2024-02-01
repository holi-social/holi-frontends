import type { NextApiRequest } from 'next'
import { Ni18nOptions } from 'ni18n'

import { addTranslations } from '@holi/web/helpers/addTranslations'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

const mockLoadTranslations = jest.fn()

jest.mock('ni18n', () => ({
  loadTranslations: (config: Ni18nOptions, locale: string, ns: string[]) => mockLoadTranslations(config, locale, ns),
}))

describe('addTranslations', () => {
  it('should add translations and locale to page props', async () => {
    const mockedTranslations = { i18n: { key: 'value' } }
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    const existingProps = { foo: 'bar' }
    const props = await addTranslations({} as NextApiRequest, existingProps)

    expect(props).toEqual({
      foo: 'bar',
      locale: 'de',
      ...mockedTranslations,
    })
  })

  it('should pass correct paramters to load translations', async () => {
    await addTranslations({} as NextApiRequest, {})

    expect(mockLoadTranslations).toHaveBeenCalledWith(ni18nConfig, 'de', ni18nConfig.ns)
  })
})
