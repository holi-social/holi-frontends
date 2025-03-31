import { HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { GetServerSidePropsContext } from 'next'

import { createPageContextMock, graphqlLink } from '@holi/web/__tests__/helpers'
import { getServerSideProps, insightsCountQuery } from '@holi/web/pages/sitemap/insights.xml'

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: true,
}))

const server = setupServer(
  graphqlLink.query(insightsCountQuery, () => {
    return HttpResponse.json({
      data: {
        lastInsights: {
          totalResults: 723,
        },
      },
    })
  })
)

describe('Insights sitemap index', () => {
  beforeAll(() => server.listen())

  afterEach(() => server.resetHandlers())

  afterAll(() => server.close())

  it('should render sitemap index for insights', async () => {
    const { context, writeMock } = createPageContextMock()

    await getServerSideProps(context)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://app.holi.social/en/sitemap/insights/0.xml</loc>
        </sitemap>
        <sitemap>
          <loc>https://app.holi.social/en/sitemap/insights/1.xml</loc>
        </sitemap>
        </sitemapindex>
       "
    `)
  })

  it('should render sitemap index for insights for german locale', async () => {
    const { context, writeMock } = createPageContextMock({ locale: 'de' })

    await getServerSideProps(context as GetServerSidePropsContext)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://app.holi.social/de/sitemap/insights/0.xml</loc>
        </sitemap>
        <sitemap>
          <loc>https://app.holi.social/de/sitemap/insights/1.xml</loc>
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
