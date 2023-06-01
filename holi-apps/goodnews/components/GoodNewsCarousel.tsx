import { useQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native'
import PaginationDot from 'react-native-animated-pagination-dot'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Carousel from 'react-native-reanimated-carousel'

import { logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { colors } from '@holi/ui/styles/globalVars'

import {
  GoodNewsArticlesQuery,
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
} from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'
import GoodNewsHeader from './GoodNewsHeader'
import GoodNewsTeaserComponent from './GoodNewsTeaserComponent'

type GoodNewsCarouselProps = Record<string, never>

type CarouselItem = {
  type: 'article' | 'teaser'
  article: GoodNewsArticle
}
export type GoodNewsArticleParams = {
  articleId?: string
}
const { useParam } = createParam<GoodNewsArticleParams>()

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsCarousel: React.VFC<GoodNewsCarouselProps> = () => {
  const { width, height } = useWindowDimensions()
  const styles = useMemo(() => getStyles(width, height), [width, height])
  const { setOptions } = useUnifiedNavigation()
  const { i18n } = useTranslation()
  const dateFormat = new Intl.DateTimeFormat(i18n.language)

  const { loading, error, data, fetchMore } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(
    GoodNewsArticlesQuery,
    {
      variables: {
        lastDate: undefined,
      },
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
    setOptions({
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
      headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
    })
  }, [setOptions, activeArticleFormattedDate])

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
    [activeArticleIndex, memoizedFetchMore, styles.article]
  )

  if (error) {
    logError(error, `[GoodNewsCarousel.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  if (!articles || !articles.length) {
    console.debug('[GoodNewsCarousel.tsx] articles array is empty')
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
        style={styles.carousel}
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

export default GoodNewsCarousel
const paginationDotAreaHeight = 50

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    article: {
      paddingBottom: paginationDotAreaHeight,
    },
    carousel: {
      width: width,
      height: height,
      ...Platform.select({
        native: {
          flex: 1,
        },
      }),
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
