import { generateSitemapIndex, generateSitemapUrlSet } from '@holi/web/helpers/sitemap'

describe('generateSitemapIndex', () => {
  it('should create correct xml', () => {
    const prefix = 'https://app.holi.social/en'
    const urls = ['/sitemap/insights/1', '/sitemap/insights/2']

    const xml = generateSitemapIndex(prefix, urls)

    expect(xml).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://app.holi.social/en/sitemap/insights/1.xml</loc>
        </sitemap>
        <sitemap>
          <loc>https://app.holi.social/en/sitemap/insights/2.xml</loc>
        </sitemap>
        </sitemapindex>
       "
    `)
  })
})

describe('generateSitemapUrlSet', () => {
  it('should create correct xml', () => {
    const prefix = 'https://app.holi.social/en'
    const urls = ['/spaces', '/donations']

    const xml = generateSitemapUrlSet(prefix, urls)

    expect(xml).toMatchInlineSnapshot(`
      "<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://app.holi.social/en/spaces</loc>
        </url>
        <url>
          <loc>https://app.holi.social/en/donations</loc>
        </url>
        </urlset>
      "
    `)
  })
})
