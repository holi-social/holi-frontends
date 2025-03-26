import type { GetServerSidePropsContext } from 'next'

import { locales } from '@holi/core/i18n/locales.cjs'
import { getOrigin } from '@holi/web/helpers/getOrigin'
import { generateSitemapIndex } from '@holi/web/helpers/sitemap'

const SiteMap = () => {
  // Content is written to response in getServerSideProps
}

const sitemapIndexUrls = ['/sitemap/static', '/sitemap/insights']

export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  const origin = getOrigin(req)
  const sitemap = generateSitemapIndex(
    origin,
    locales.flatMap((locale) => sitemapIndexUrls.map((url) => `/${locale}${url}`))
  )

  if (res) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()
  }

  return {
    props: {},
  }
}

export default SiteMap
