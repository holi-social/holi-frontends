import { HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { NextPageContext } from 'next'

import { createPageContextMock, graphqlLink } from '@holi/web/__tests__/helpers'
import { getServerSideProps, topicSlugsQuery } from '@holi/web/pages/sitemap/static.xml'

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: true,
}))

const server = setupServer(
  graphqlLink.query(topicSlugsQuery, () => {
    return HttpResponse.json({
      data: {
        topics: {
          data: [{ slug: 'topic-1' }, { slug: 'topic-2' }],
        },
      },
    })
  })
)

describe('Static sitemap index', () => {
  beforeAll(() => server.listen())

  afterEach(() => server.resetHandlers())

  afterAll(() => server.close())

  it('should render sitemap index with static urls', async () => {
    const { context, writeMock } = createPageContextMock()

    await getServerSideProps(context)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://app.holi.social/en/</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/donations</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/volunteering</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/curationPrinciples</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/login</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/profile</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=topic-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=topic-2</loc>
        </url>
        </urlset>
      "
    `)
  })

  it('should render sitemap index with static urls for german locale', async () => {
    const { context, writeMock } = createPageContextMock({ locale: 'de' })

    await getServerSideProps(context as NextPageContext)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://app.holi.social/de/</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spenden</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/ehrenamt</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/curationPrinciples</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/login</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/profile</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=topic-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=topic-2</loc>
        </url>
        </urlset>
      "
    `)
  })

  it('should set correct content type', async () => {
    const { context, setHeaderMock } = createPageContextMock()

    await getServerSideProps(context as NextPageContext)

    expect(setHeaderMock).toHaveBeenCalledWith('Content-Type', 'text/xml')
  })
})
