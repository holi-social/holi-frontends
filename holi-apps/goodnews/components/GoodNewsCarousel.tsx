import { useQuery } from '@apollo/client'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import { logError } from '@holi/core/errors/helpers'

import {
  GoodNewsArticlesQuery,
  GoodNewsArticlesQueryArgs,
  GoodNewsArticlesQueryResponse,
} from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

import GoodNewsArticleComponent from './GoodNewsArticleComponent'
import HoliButton from "@holi/ui/components/molecules/HoliButton"

type GoodNewsCarouselProps = Record<string, never>

/** This is a temporary component and should be replaced by a carousel-style component later */
const GoodNewsCarousel: React.VFC<GoodNewsCarouselProps> = () => {
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
    return fetchingMore ? t('goodnews:listing.loadMoreButton.loading') : t('goodnews:listing.loadMoreButton.text')
  }, [fetchingMore, t])

  const carouselRef = useRef<Carousel<GoodNewsArticle> | null>(null)
  const [activeSlide, setActiveSlide] = useState<number>(0)

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
      <Carousel
        ref={(c) => (carouselRef.current = c)}
        data={articles}
        renderItem={({ item }) => <GoodNewsArticleComponent article={item} key={item.id} />}
        onSnapToItem={(index) => setActiveSlide(index)}
        sliderWidth={width}
        itemWidth={width}
        contentContainerCustomStyle={{ flexBasis: 'auto', flexGrow: 1 }}
      />
      <Pagination
        tappableDots={true}
        carouselRef={carouselRef}
        dotsLength={articles.length}
        activeDotIndex={activeSlide}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationDotInactive}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={{ flexBasis: 'auto', flexGrow: 0, flexShrink: 1 }}
      />
      {/*<HoliButton label={fetchMoreButtonText} onPress={memoizedFetchMore} testID="btn-goodnews-list-load-more">
        {fetchMoreButtonText}
      </HoliButton>*/}
    </>
  )
}

export default GoodNewsCarousel

const styles = StyleSheet.create({
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 16,
    marginHorizontal: 0,
  },
  paginationDotInactive: {
    // Define styles for inactive dots here
  },
})
