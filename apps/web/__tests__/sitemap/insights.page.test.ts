import { HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { GetServerSidePropsContext } from 'next'

import { createPageContextMock, graphqlLink } from '@holi/web/__tests__/helpers'
import { getServerSideProps, insightsWithRelatedIdsQuery } from '@holi/web/pages/sitemap/insights/[page]'

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: true,
}))

const createObjectsWithIds = (insightId: string, prefix: string) => [
  { id: `${prefix}-${insightId}-0` },
  { id: `${prefix}-${insightId}-1` },
]

const createInsightWithRelatedIds = (id: string) => ({
  id,
  posts: createObjectsWithIds(id, 'post'),
  recommendations: createObjectsWithIds(id, 'reco'),
  quotes: createObjectsWithIds(id, 'quote'),
  initiatives: createObjectsWithIds(id, 'initiative'),
  discussions: createObjectsWithIds(id, 'discussion'),
})

const server = setupServer(
  graphqlLink.query(insightsWithRelatedIdsQuery, ({ variables }) => {
    return HttpResponse.json({
      data: {
        lastInsights: {
          data: Array.from({ length: 5 }, (_, index) =>
            createInsightWithRelatedIds((variables.offset + index).toString())
          ),
        },
      },
    })
  })
)

describe('Insights sitemap page', () => {
  beforeAll(() => server.listen())

  afterEach(() => server.resetHandlers())

  afterAll(() => server.close())

  it('should render sitemap for paginated insights', async () => {
    const { context, writeMock } = createPageContextMock({ query: { page: '2' } })

    await getServerSideProps(context)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://app.holi.social/en/insights/1000</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/posts/post-1000-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/posts/post-1000-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/recommendations/reco-1000-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/recommendations/reco-1000-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/quotes/quote-1000-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/quotes/quote-1000-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/initiatives/initiative-1000-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/initiatives/initiative-1000-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/discussions/discussion-1000-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1000/discussions/discussion-1000-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/posts/post-1001-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/posts/post-1001-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/recommendations/reco-1001-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/recommendations/reco-1001-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/quotes/quote-1001-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/quotes/quote-1001-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/initiatives/initiative-1001-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/initiatives/initiative-1001-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/discussions/discussion-1001-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1001/discussions/discussion-1001-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/posts/post-1002-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/posts/post-1002-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/recommendations/reco-1002-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/recommendations/reco-1002-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/quotes/quote-1002-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/quotes/quote-1002-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/initiatives/initiative-1002-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/initiatives/initiative-1002-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/discussions/discussion-1002-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1002/discussions/discussion-1002-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/posts/post-1003-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/posts/post-1003-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/recommendations/reco-1003-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/recommendations/reco-1003-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/quotes/quote-1003-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/quotes/quote-1003-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/initiatives/initiative-1003-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/initiatives/initiative-1003-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/discussions/discussion-1003-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1003/discussions/discussion-1003-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/posts/post-1004-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/posts/post-1004-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/recommendations/reco-1004-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/recommendations/reco-1004-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/quotes/quote-1004-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/quotes/quote-1004-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/initiatives/initiative-1004-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/initiatives/initiative-1004-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/discussions/discussion-1004-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/insights/1004/discussions/discussion-1004-1</loc>
        </url>
        </urlset>
      "
    `)
  })

  it('should render sitemap for paginated insights for german locale', async () => {
    const { context, writeMock } = createPageContextMock({ query: { page: '0' }, locale: 'de' })

    await getServerSideProps(context as GetServerSidePropsContext)

    const response = writeMock.mock.lastCall[0]
    expect(response).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://app.holi.social/de/insights/0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/posts/post-0-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/posts/post-0-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/recommendations/reco-0-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/recommendations/reco-0-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/quotes/quote-0-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/quotes/quote-0-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/initiatives/initiative-0-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/initiatives/initiative-0-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/discussions/discussion-0-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/0/discussions/discussion-0-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/posts/post-1-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/posts/post-1-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/recommendations/reco-1-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/recommendations/reco-1-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/quotes/quote-1-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/quotes/quote-1-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/initiatives/initiative-1-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/initiatives/initiative-1-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/discussions/discussion-1-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/1/discussions/discussion-1-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/posts/post-2-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/posts/post-2-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/recommendations/reco-2-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/recommendations/reco-2-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/quotes/quote-2-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/quotes/quote-2-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/initiatives/initiative-2-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/initiatives/initiative-2-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/discussions/discussion-2-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/2/discussions/discussion-2-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/posts/post-3-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/posts/post-3-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/recommendations/reco-3-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/recommendations/reco-3-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/quotes/quote-3-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/quotes/quote-3-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/initiatives/initiative-3-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/initiatives/initiative-3-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/discussions/discussion-3-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/3/discussions/discussion-3-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/posts/post-4-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/posts/post-4-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/recommendations/reco-4-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/recommendations/reco-4-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/quotes/quote-4-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/quotes/quote-4-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/initiatives/initiative-4-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/initiatives/initiative-4-1</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/discussions/discussion-4-0</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/insights/4/discussions/discussion-4-1</loc>
        </url>
        </urlset>
      "
    `)
  })

  it('should set correct content type', async () => {
    const { context, setHeaderMock } = createPageContextMock({ query: { page: '0' } })

    await getServerSideProps(context as GetServerSidePropsContext)

    expect(setHeaderMock).toHaveBeenCalledWith('Content-Type', 'text/xml')
  })
})
