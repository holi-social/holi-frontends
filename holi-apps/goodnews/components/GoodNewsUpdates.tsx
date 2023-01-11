import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'
import tinycolor from 'tinycolor2'

import { logError } from '@holi/core/errors/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'

import GoodNewsUpdatesItem from '@holi-apps/goodnews/components/GoodNewsUpdatesItem'
import { GoodNewsArticlesQuery, GoodNewsArticlesQueryResponse } from '@holi-apps/goodnews/queries'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

const PROJECT_PAGE_SIZE = 5

type GoodNewsUpdatesProps = {
  locationQuery?: string
  style?: StyleProp<ViewStyle>
}

const GoodNewsUpdates: React.VFC<GoodNewsUpdatesProps> = ({ style }: GoodNewsUpdatesProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const cardImageSize = Platform.OS === 'web' ? 160 : screenWidth / 2 - 26

  const { data, error, loading } = useQuery<GoodNewsArticlesQueryResponse>(GoodNewsArticlesQuery, {
    fetchPolicy: 'cache-and-network',
  })

  if (error) {
    logError(error, t('goodnews:goodnewsListing.error'))
  }

  const { articles = [] } = data?.appGoodNews_articles || {}

  const articlesToRender = articles.slice(0, PROJECT_PAGE_SIZE)

  const renderItem = ({ item, index }: { item: GoodNewsArticle; index: number }) => {
    return <GoodNewsUpdatesItem key={index} article={item} />
  }

  const seeMore = () => {
    return loading ? (
      <View style={styles.loadingContainer}>
        <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
      </View>
    ) : (
      <HoliButton
        label={t('goodnews:goodnewsListing.loadMoreButton.text')}
        style={[styles.buttonContainer, styles.lastButtonContainer]}
        onPress={() => navigate('/apps/goodnews/')}
        transparent
        inline
        testID={'goodnews-updates-load-more-button'}
      >
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_see_more.png')}
          width={cardImageSize}
          height={cardImageSize}
          label=""
        />
        <View style={styles.seeMoreContainer}>
          <HoliText style={styles.seeMoreText} size="small" bold>
            {t('goodnews:goodnewsListing.loadMoreButton.text')}
          </HoliText>
        </View>
      </HoliButton>
    )
  }

  return (
    <View style={style}>
      <View style={styles.goodNewsHeader} testID={'goodNews-updates-heading'}>
        <View style={styles.goodNewsIconContainer}>
          <HoliIcon icon="newspaper" size={20} color={colors.fontColorGrey} />
        </View>
        <HoliHeading style={{ marginLeft: 12 }}>{t('goodnews:app.name')}</HoliHeading>
      </View>
      <FlatList
        horizontal
        ListHeaderComponentStyle={styles.listHeader}
        data={articlesToRender}
        renderItem={renderItem}
        style={styles.itemsContainer}
        ListFooterComponent={seeMore}
        testID={'goodnews-updates-container'}
      />
    </View>
  )
}
export default GoodNewsUpdates

const styles = StyleSheet.create({
  goodNewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listHeader: {
    paddingTop: Number(variables.topBarHeight) + 24,
    paddingBottom: 32,
  },

  goodNewsIconContainer: {
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tinycolor(colors.borderColorGrey).darken(5).toString(),
    backgroundColor: colors.backgroundColorGrey,
  },
  goodNewsListingItem: {
    height: 'auto',
    width: 160,
  },
  itemsContainer: {
    paddingVertical: 24,
    marginHorizontal: -20,
    paddingLeft: 24,
  },
  buttonContainer: {
    marginRight: 11,
  },
  loadingContainer: {
    width: 160,
    height: 160,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColorGrey,
  },
  lastButtonContainer: {
    marginRight: Platform.OS === 'web' ? 24 : 48,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seeMoreText: {
    color: colors.secondaryColor,
    textAlign: 'center',
    marginTop: 16,
  },
})
