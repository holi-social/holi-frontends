import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Spacing } from 'holi-bricks/foundations'
import type { SearchFilter } from '@holi/core/screens/search/types'

interface NoSearchResultsProps {
  filter: SearchFilter
}

export const NoSearchResults = ({ filter }: NoSearchResultsProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  const message = !filter.query
    ? t('search.typesense.noResultsLocation.headline', { location: filter.location?.label ?? '' })
    : t('search.typesense.noResults.headline', { query: filter.query })
  return (
    <View style={styles.container}>
      <View style={styles.animation}>
        <HoliLottie animType="noSearchResults" />
      </View>
      <View style={styles.text}>
        <Text size="lg">{message}</Text>
        <Text size="sm">{t('search.typesense.noResults.description')}</Text>
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet({
  container: {
    flexDirection: 'row',
    gap: Spacing['xs'],
  },
  animation: {
    width: 60,
    height: 120,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing['4xs'],
  },
})
