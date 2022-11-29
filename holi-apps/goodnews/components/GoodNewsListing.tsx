import { useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { logError } from '@holi/core/errors/helpers'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

import {
  GoodNewsArticlesQuery,
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
} from '@holi-apps/goodnews/queries'

type GoodNewsListingProps = Record<string, never>

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsListing: React.VFC<GoodNewsListingProps> = () => {
  const { t, i18n } = useTranslation()
  const [fetchingMore, setFetchingMore] = useState(false)
  const {
    loading,
    error,
    data: response,
    fetchMore,
  } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(GoodNewsArticlesQuery, {
    variables: {
      locale: i18n.language,
      lastDate: undefined,
    },
  })

  const oldestDate: string | undefined = useMemo(() => {
    return !response
      ? undefined
      : response.appGoodNews_articles.reduce((prev, curr) => {
          if (!prev) return curr
          else if (curr.date.localeCompare(prev.date) === -1) return curr
          else return prev
        }, response.appGoodNews_articles[0]).date
  }, [response])

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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (
    <>
      {response!.appGoodNews_articles.map((article) => {
        return <HoliText key={article.pictureUrl}>{article.headline}</HoliText>
      })}
      <HoliButton label={fetchMoreButtonText} onPress={memoizedFetchMore} />
    </>
  )
}

export default GoodNewsListing
