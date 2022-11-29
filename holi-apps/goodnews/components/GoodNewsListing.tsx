import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'

import {
  GoodNewsArticlesQuery,
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
} from '@holi-apps/goodnews/queries'

type GoodNewsListingProps = Record<string, never>

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsListing: React.VFC<GoodNewsListingProps> = () => {
  const { i18n } = useTranslation()
  const {
    loading,
    error,
    data: response,
  } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(GoodNewsArticlesQuery, {
    variables: {
      locale: i18n.language,
      lastDate: undefined,
    },
  })

  if (error) {
    logError(error, `[GoodNewsListing.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return response!.appGoodNews_articles.map((article) => {
    return <HoliText key={article.pictureUrl}>{article.headline}</HoliText>
  })
}

export default GoodNewsListing
