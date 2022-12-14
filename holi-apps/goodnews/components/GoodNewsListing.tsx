import { useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import {
  GoodNewsArticlesQuery,
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
} from '@holi-apps/goodnews/queries'

import GoodNewsCarousel from './GoodNewsCarousel'

type GoodNewsListingProps = Record<string, never>

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsListing: React.VFC<GoodNewsListingProps> = () => {
  const { t, i18n } = useTranslation()
  const { width } = useWindowDimensions()
  const [fetchingMore, setFetchingMore] = useState(false)
  const { loading, error, data, fetchMore } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(
    GoodNewsArticlesQuery,
    {
      variables: {
        locale: i18n.language,
        lastDate: undefined,
      },
    }
  )
  const articles = data?.appGoodNews_articles.articles
  const oldestDate: string | undefined = useMemo(() => {
    return articles ? articles[articles.length - 1].date : undefined
  }, [articles])

  const memoizedFetchMore = useCallback(() => {
    return fetchMore({
      variables: {
        lastDate: oldestDate,
      },
    }).finally(() => setFetchingMore(false))
  }, [fetchMore, oldestDate])

  const fetchMoreButtonText = useMemo(() => {
    return fetchingMore
      ? t('goodnews:goodnewsListing.loadMoreButton.loading')
      : t('goodnews:goodnewsListing.loadMoreButton.text')
  }, [fetchingMore, t])

  if (error) {
    logError(error, `[GoodNewsListing.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  return (
    <>
      <GoodNewsCarousel articles={articles!} width={width} />
      <HoliButton label={fetchMoreButtonText} onPress={memoizedFetchMore} testID="btn-goodnews-list-load-more">
        {fetchMoreButtonText}
      </HoliButton>
    </>
  )
}

export default GoodNewsListing
