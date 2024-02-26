import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native'
import PaginationDot from 'react-native-animated-pagination-dot'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Carousel from 'react-native-reanimated-carousel'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useTheme } from '@holi/ui/styles/theme'

import {
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
  goodNewsArticlesQuery,
} from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'
import GoodNewsHeader from './GoodNewsHeader'
import GoodNewsTeaserComponent from './GoodNewsTeaserComponent'

type CarouselItem = {
  type: 'article' | 'teaser'
  article: GoodNewsArticle
}
export type GoodNewsArticleParams = {
  articleId?: string
}
const { useParam } = createParamHooks<GoodNewsArticleParams>()

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsCarousel = () => {
  const { width, height } = useWindowDimensions()
  const { i18n } = useTranslation()
  const dateFormat = new Intl.DateTimeFormat(i18n.language)
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme

  const { loading, error, data, fetchMore } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(
    goodNewsArticlesQuery,
    {
      variables: {
        lastDate: undefined,
      },
      onError: (error) =>
        logError(error, 'Failed to load good news articles', {
          location: 'GoodNewsCarousel.GoodNewsArticlesQuery',
        }),
    }
  )
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

  const activeArticleFormattedDate =
    articles[activeArticleIndex] && dateFormat.format(Date.parse(articles[activeArticleIndex].date))

  useEffect(() => {
    setScreenOptions({
      headerTitle: ({ tintColor }) => {
        return <GoodNewsHeader tintColor={tintColor} formattedDate={activeArticleFormattedDate} />
      },
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTintColor: colors.background10,
      navigationCustomOptions: {
        headerBackgroundGradient: true,
        footerShown: false,
      },
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
    })
  }, [activeArticleFormattedDate, setScreenOptions])

  useEffect(() => {
    if (paramArticleId) {
      const index = articles?.findIndex((article) => article.id === paramArticleId) || -1
      if (index >= 0) {
        setActiveArticleIndex(index)
      }
    }
  }, [articles, paramArticleId, setActiveArticleIndex])

  const renderItem = useCallback(
    ({ item, index }: { item: CarouselItem; index: number }) => {
      const accessible = index === activeArticleIndex
      return item.type === 'article' ? (
        <GoodNewsArticleComponent
          article={item.article}
          key={item.article.id}
          accessible={accessible}
          style={styles.article}
        />
      ) : (
        <GoodNewsTeaserComponent
          article={item.article}
          key={item.article.id}
          fetchMore={memoizedFetchMore}
          accessible={accessible}
        />
      )
    },
    [activeArticleIndex, memoizedFetchMore]
  )

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  if (!articles || !articles.length) {
    logDebug('GoodNewsCarousel', 'articles array is empty')
    return <></>
  }
  const carouselItems: CarouselItem[] = articles
    .map((article) => ({ type: 'article', article: article } as CarouselItem))
    .concat(previousDateTeaser ? [{ type: 'teaser', article: previousDateTeaser }] : [])

  return (
    <GestureHandlerRootView style={styles.rootView}>
      {/* props documentation https://github.com/dohooo/react-native-reanimated-carousel/blob/HEAD/docs/props.md */}
      <Carousel
        width={width}
        height={height}
        loop={false}
        data={carouselItems}
        defaultIndex={activeArticleIndex}
        renderItem={renderItem}
        onSnapToItem={setActiveArticleIndex}
        scrollAnimationDuration={250}
        testID={'goodnews-list-container'}
      />
      <SafeAreaView
        style={styles.paginationDotArea}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
      >
        <PaginationDot
          activeDotColor={colors.foreground30}
          inactiveDotColor={colors.foreground20}
          curPage={activeArticleIndex}
          maxPage={carouselItems.length}
          sizeRatio={1.0}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default withProfiler(GoodNewsCarousel, { name: 'GoodNewsCarousel' })

const paginationDotAreaHeight = 50

const styles = StyleSheet.create({
  article: {
    paddingBottom: paginationDotAreaHeight,
  },
  paginationDotArea: {
    zIndex: -1,
    backgroundColor: 'transparent',
    bottom: 12,
    minHeight: paginationDotAreaHeight,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  rootView: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
