import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

import { logError } from '@holi/core/errors/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import {
  GoodNewsArticlesQuery,
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
} from '@holi-apps/goodnews/queries'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'
import GoodNewsHeader from './GoodNewsHeader'

type GoodNewsCarouselProps = Record<string, never>

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsCarousel: React.VFC<GoodNewsCarouselProps> = () => {
  const { i18n } = useTranslation()
  const { width, height } = useWindowDimensions()
  const styles = useMemo(() => createStyles(width, height), [width, height])
  const { setOptions } = useUnifiedNavigation()
  const { loading, error, data } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(
    GoodNewsArticlesQuery,
    {
      variables: {
        locale: i18n.language,
        lastDate: undefined,
      },
    }
  )
  const articles = data?.appGoodNews_articles.articles

  /* TODO for usage in paging (HOLI-2508)
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

  const fetchMoreButtonText = useMemo(() => {
    return fetchingMore ? t('goodnews:listing.loadMoreButton.loading') : t('goodnews:listing.loadMoreButton.text')
  }, [fetchingMore, t])
  */

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

  return (
    <>
      {/* props documentation https://github.com/dohooo/react-native-reanimated-carousel/blob/HEAD/docs/props.md */}
      <Carousel
        width={width}
        style={styles.carousel}
        loop={false}
        data={articles}
        renderItem={({ item }) => <GoodNewsArticleComponent article={item} key={item.id} />}
        onSnapToItem={(index) => setActiveArticleIndex(index)}
        scrollAnimationDuration={250}
        testID={'goodnews-list-container'}
      />
      <View style={styles.paginationDotArea}>
        <HoliText>
          {activeArticleIndex + 1} / {articles.length} {/* TODO render dots */}
        </HoliText>
      </View>
      {/* TODO for usage in paging (HOLI-2508)
      <HoliButton label={fetchMoreButtonText} onPress={memoizedFetchMore} testID="btn-goodnews-list-load-more">
        {fetchMoreButtonText}
      </HoliButton>
      */}
    </>
  )
}

export default GoodNewsCarousel

const createStyles = (width: number, height: number) => {
  const paginationDotAreaHeight = 40
  return StyleSheet.create({
    carousel: {
      width: width,
      height: height - paginationDotAreaHeight,
    },
    paginationDotArea: {
      backgroundColor: colors.backgroundColorGreyLight,
      minHeight: paginationDotAreaHeight,
      height: paginationDotAreaHeight,
      alignSelf: 'center',
    },
  })
}
