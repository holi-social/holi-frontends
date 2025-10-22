import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { getLogger } from '@holi/core/helpers/logging'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliSwiper from '@holi/ui/components/molecules/HoliSwiper/index'
import { dimensions } from '@holi/ui/styles/globalVars'

import {
  type GoodNewsArticlesQueryArgs,
  type GoodNewsArticlesQueryResponse,
  goodNewsArticlesQuery,
} from '@holi-apps/goodnews/queries'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'
import GoodNewsTeaserComponent from './GoodNewsTeaserComponent'
import { useApolloErrorLogging } from '@holi/core/hooks/useApolloErrorLogging'

const logger = getLogger('GoodNews')

type CarouselItem = {
  type: 'article' | 'teaser'
  article: GoodNewsArticle
}

export type GoodNewsArticleParams = {
  articleId?: string
}

const { useParam } = createParamHooks<GoodNewsArticleParams>()

interface GoodNewsCarouselProps {
  onActiveDateChange: (formattedDate: string) => void
}

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsCarousel = ({ onActiveDateChange }: GoodNewsCarouselProps) => {
  const { height } = useWindowDimensions()
  const { i18n } = useTranslation()
  const dateFormat = new Intl.DateTimeFormat(i18n.language)

  const { loading, error, data, fetchMore, refetch } = useQuery<
    GoodNewsArticlesQueryResponse,
    GoodNewsArticlesQueryArgs
  >(goodNewsArticlesQuery, {
    variables: {
      lastDate: undefined,
    },
  })
  useOnRefresh(refetch)
  useApolloErrorLogging(error, 'Failed to load good news articles', {
    location: 'GoodNewsCarousel.GoodNewsArticlesQuery',
  })

  const { articles = [], previousDateTeaser } = data?.appGoodNews_articles || {}

  const oldestDate: string | undefined = useMemo(() => {
    return articles.length ? articles[articles.length - 1].date : undefined
  }, [articles])

  const memoizedFetchMore = useCallback(() => {
    return fetchMore({
      variables: {
        lastDate: oldestDate,
      },
    })
  }, [fetchMore, oldestDate])

  const [activeArticleIndex, setActiveArticleIndex] = useState<number>(0)

  const [paramArticleId] = useParam('articleId', singleParamConfig)
  const initialArticleIndex = paramArticleId ? articles.findIndex((article) => article.id === paramArticleId) : 0

  const activeArticleFormattedDate =
    articles[activeArticleIndex] && dateFormat.format(Date.parse(articles[activeArticleIndex].date))

  useEffect(() => {
    onActiveDateChange(activeArticleFormattedDate)
  }, [activeArticleFormattedDate, onActiveDateChange])

  useEffect(() => {
    if (paramArticleId) {
      const index = articles?.findIndex((article) => article.id === paramArticleId) || -1
      if (index >= 0) {
        setActiveArticleIndex(index)
      }
    }
  }, [articles, paramArticleId, setActiveArticleIndex])

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  if (!articles || !articles.length) {
    logger.debug('GoodNewsCarousel', 'articles array is empty')
    return <></>
  }

  const carouselItems: CarouselItem[] = articles
    .map((article) => ({ type: 'article', article: article }) as CarouselItem)
    .concat(previousDateTeaser ? [{ type: 'teaser', article: previousDateTeaser }] : [])

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <View style={{ width: '100%', maxWidth: dimensions.maxScreenWidth + 160, flex: 1 }}>
        <HoliSwiper
          initialSlide={initialArticleIndex}
          height={height}
          onSlideChange={setActiveArticleIndex}
          count={carouselItems.length}
        >
          {carouselItems.map((item, index) => (
            <HoliSwiper.Slide virtualIndex={index} key={item.article.id}>
              {({ isActive }) => (
                <View style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                  {item.type === 'article' ? (
                    <GoodNewsArticleComponent
                      article={item.article}
                      key={item.article.id}
                      accessible={isActive}
                      style={styles.article}
                    />
                  ) : (
                    <GoodNewsTeaserComponent
                      article={item.article}
                      key={item.article.id}
                      fetchMore={memoizedFetchMore}
                      accessible={isActive}
                    />
                  )}
                </View>
              )}
            </HoliSwiper.Slide>
          ))}
        </HoliSwiper>
      </View>
    </View>
  )
}

export default withProfiler(GoodNewsCarousel, { name: 'GoodNewsCarousel' })

const styles = StyleSheet.create({
  article: {
    height: '100%',
  },
  rootView: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
