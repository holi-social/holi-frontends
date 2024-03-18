import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import InsightFavoriteCard from '@holi/core/screens/favorites/components/InsightFavoriteCard'
import { Insight } from '@holi/core/screens/insights/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const InsightFavoritesList = () => {
  const { data: insights } = usePaginationContext<Insight>()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const imageWidth = 251

  const NoFavorites = () => {
    return (
      <View style={styles.noFavoritesContainer}>
        {/**TODO: change the source image to the actual illustration */}
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_digital_tools.svg')}
          width={imageWidth}
          height={imageWidth * 0.7}
          label="no-favorites"
          isSvg={true}
          resizeMode="stretch"
          style={styles.illustration}
        />
        <HoliText size="small">{t('favorites.noResults.title')}</HoliText>
        <HoliText size="large" style={styles.noFavoritesDescription}>
          {t('favorites.noResults.description')}
        </HoliText>
      </View>
    )
  }

  return insights.length > 0 ? (
    <View>
      {insights.map((insight) => (
        <InsightFavoriteCard insight={insight} key={insight.id} />
      ))}
    </View>
  ) : (
    <NoFavorites />
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    noFavoritesContainer: {
      marginTop: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
      margin: 24,
      padding: 24,
      alignItems: 'center',
    },
    illustration: {
      marginTop: 32,
      marginBottom: 24,
    },
    noFavoritesDescription: { textAlign: 'center', marginTop: 8, color: theme.colors.foreground30 },
  })

export default InsightFavoritesList
