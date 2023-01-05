import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

//import { article } from '@holi-apps/goodnews/components/__tests__/testData'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsUpdatesItemProps = {
  article: GoodNewsArticle
  style?: StyleProp<ViewStyle>
}

const GoodNewsUpdatesItem: React.VFC<GoodNewsUpdatesItemProps> = ({ article, style }: GoodNewsUpdatesItemProps) => {
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)
  const { i18n } = useTranslation()

  const params = new URLSearchParams()

  const formattedDate = useMemo(() => {
    if (!article.date) return undefined
    const dateString = getRelativeDateString(article.date, i18n.language)
    return dateString.charAt(0).toUpperCase() + dateString.slice(1)
  }, [article.date, i18n.language])

  return (
    <HoliButton
      label={article.headline}
      transparent
      onPress={() => navigate('/apps/goodnews/')}
      style={[styles.buttonContainer, style]}
      testID={'goodnews-updates-item'}
      inline
    >
      <HoliImage source={{ uri: article.pictureUrl }} label={article.headline} sizes="180px" style={styles.mainImage} />

      <HoliText size="small" bold numberOfLines={2} selectable style={{ marginTop: 16 }}>
        {article.headline}
      </HoliText>
      <HoliText size="small" numberOfLines={2} selectable style={{ marginTop: 8, color: 'grey' }}>
        {formattedDate}
      </HoliText>
    </HoliButton>
  )
}

export default GoodNewsUpdatesItem

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    buttonContainer: {
      width: Platform.OS === 'web' ? 160 : screenWidth / 2 - 26,
      marginRight: 12,
    },
    mainImage: {
      aspectRatio: 1,
      borderRadius: 8,
      height: Platform.OS === 'web' ? '100%' : 'auto',
    },
  })
