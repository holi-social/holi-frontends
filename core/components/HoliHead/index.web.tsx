import Head from 'next/head'
import React from 'react'
import type { PropsWithChildren } from 'react'

import { HoliHeadProps } from '@holi/core/components/HoliHead/types'

const MAX_LENGTH_OG_DESCRIPTION = 160

const HoliHead = ({ title, description, ogTitle, ogDescription, ogImage }: PropsWithChildren<HoliHeadProps>) => {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} key="description" />}
      {ogTitle && <meta property="og:title" content={ogTitle} key="ogTitle" />}
      {ogDescription && (
        <meta
          property="og:description"
          content={ogDescription.substring(0, MAX_LENGTH_OG_DESCRIPTION)}
          key="ogDescription"
        />
      )}
      {ogImage && <meta property="og:image" content={ogImage} key="ogImage" />}
    </Head>
  )
}

export default HoliHead
