import { useQuery } from '@apollo/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native'
import PaginationDot from 'react-native-animated-pagination-dot'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Carousel from 'react-native-reanimated-carousel'

import { logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
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

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsCarousel: React.VFC<GoodNewsCarouselProps> = () => {
  const { i18n } = useTranslation()
  const { width, height } = useWindowDimensions()
  const styles = useMemo(() => getStyles(width, height), [width, height])
  const { setOptions } = useUnifiedNavigation()
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
  const previousDateTeaser = data?.appGoodNews_articles.previousDateTeaser
  const paginationDotAreaHeight = 40

  const [fetchingMore, setFetchingMore] = useState(false)

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

  const [activeArticleIndex, setActiveArticleIndex] = useState<number>(0)

  useEffect(() => {
    setOptions({
      headerTitle: ({ tintColor }) => (
        <GoodNewsHeader tintColor={tintColor} article={articles && articles[activeArticleIndex]} />
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTintColor: colors.fontColorWhite,
      navigationCustomOptions: {
        headerBackgroundGradient: true,
        footerShown: false,
      },
      headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
    })
  }, [setOptions, articles, activeArticleIndex])

  if (error) {
    logError(error, `[GoodNewsCarousel.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  if (!articles || !articles.length) {
    console.error('[GoodNewsCarousel.tsx] articles array is empty')
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
        renderItem={({ item }) =>
          item.type === 'article' ? (
            <GoodNewsArticleComponent
              article={item.article}
              key={item.article.id}
              style={{ paddingBottom: paginationDotAreaHeight }}
            />
          ) : (
            <GoodNewsTeaserComponent
              article={item.article}
              key={item.article.id}
              fetchMore={memoizedFetchMore}
              style={styles.teaser}
            />
          )
        }
        onSnapToItem={(index) => setActiveArticleIndex(index)}
        scrollAnimationDuration={250}
        testID={'goodnews-list-container'}
      />
      <SafeAreaView style={styles.paginationDotArea}>
        {!fetchingMore && (
          <PaginationDot
            activeDotColor={colors.backgroundColorModalDark}
            inactiveDotColor={colors.grey}
            curPage={activeArticleIndex}
            maxPage={carouselItems.length}
            sizeRatio={1.0}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default GoodNewsCarousel

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    carousel: {
      width: width,
      height: height,
    },
    paginationDotArea: {
      zIndex: -1,
      backgroundColor: 'transparent',
      bottom: Platform.OS === 'web' ? 32 : 0,
      position: 'absolute',
      alignSelf: 'center',
      flexDirection: 'row',
    },
    rootView: {
      flex: 1,
      justifyContent: 'space-between',
    },
    teaser: {
      paddingHorizontal: 24,
      height: height,
      width: width,
    },
  })
