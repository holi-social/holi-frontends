import type { GetServerSidePropsContext } from 'next'

import { createPageContextMock } from '@holi/web/__tests__/helpers'
import { getServerSideProps } from '@holi/web/pages/sitemap.xml'

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: true,
}))

describe('Root sitemap', () => {
  it('should render root sitemap index', async () => {
    const { context, writeMock } = createPageContextMock()

    await getServerSideProps(context)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://app.holi.social/en/sitemap/static.xml</loc>
        </sitemap>
        <sitemap>
          <loc>https://app.holi.social/en/sitemap/insights.xml</loc>
        </sitemap>
        <sitemap>
          <loc>https://app.holi.social/de/sitemap/static.xml</loc>
        </sitemap>
        <sitemap>
          <loc>https://app.holi.social/de/sitemap/insights.xml</loc>
        </sitemap>
        </sitemapindex>
       "
    `)
  })

  it('should set correct content type', async () => {
    const { context, setHeaderMock } = createPageContextMock()

    await getServerSideProps(context as GetServerSidePropsContext)

    expect(setHeaderMock).toHaveBeenCalledWith('Content-Type', 'text/xml')
  })
})
