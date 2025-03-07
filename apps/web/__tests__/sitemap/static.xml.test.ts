import { setupServer } from 'msw/node'
import type { NextPageContext } from 'next'

import { createPageContextMock } from '@holi/web/__tests__/helpers'
import { getServerSideProps } from '@holi/web/pages/sitemap/static.xml'

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: true,
}))
jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'))

const server = setupServer()

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
          <loc>https://app.holi.social/en/spaces/filter?topic=animal-welfare</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=arts-culture</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=climate-environment</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=democracy-politics</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=disability-inclusion</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=disaster-relief</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=elderly-care</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=family-kids</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=food-hunger-relief</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=gender-equality</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=housing</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=human-rights</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=lgbtqia-plus</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=lifestyle-consumption</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=literacy-education</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=mental-physical-health</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=migration-refugees</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=mobility-transport</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=other</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=peace-security</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=poverty-homelessness</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=sports-recreation</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=technology-innovation</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/spaces/filter?topic=youth-development</loc>
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
          <loc>https://app.holi.social/de/spaces/filter?topic=animal-welfare</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=arts-culture</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=climate-environment</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=democracy-politics</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=disability-inclusion</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=disaster-relief</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=elderly-care</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=family-kids</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=food-hunger-relief</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=gender-equality</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=housing</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=human-rights</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=lgbtqia-plus</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=lifestyle-consumption</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=literacy-education</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=mental-physical-health</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=migration-refugees</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=mobility-transport</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=other</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=peace-security</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=poverty-homelessness</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=sports-recreation</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=technology-innovation</loc>
        </url>
        <url>
          <loc>https://app.holi.social/de/spaces/filter?topic=youth-development</loc>
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
