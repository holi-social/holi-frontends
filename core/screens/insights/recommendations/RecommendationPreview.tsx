import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Recommendation } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

import LinkInfo from './LinkInfo'

interface RecommendationPreviewProps {
  insightId: string
  recommendation: Recommendation
}

const RecommendationPreview = ({ insightId, recommendation }: RecommendationPreviewProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <View style={styles.card}>
      <HoliButton
        label={recommendation.linkPreview.title}
        transparent
        onPress={() => navigate(`/insights/${insightId}/recommendations/${recommendation.id}`)}
      >
        {recommendation.linkPreview.image && (
          <>
            <HoliImage
              source={{ uri: recommendation.linkPreview.image }}
              label={recommendation.link}
              style={styles.image}
              resizeMode="contain"
            />
            <HoliGap size="s" />
          </>
        )}
        <View style={styles.description}>
          <HoliBadge>{t(`insights.recommendations.category.${recommendation.category.toLowerCase()}`)}</HoliBadge>
          <HoliGap size="s" />

          {recommendation.linkPreview.title && (
            <>
              <HoliHeading level="2" selectable size="s" numberOfLines={3}>
                {recommendation.linkPreview.title}
              </HoliHeading>
              <HoliGap size="s" />
            </>
          )}

          <LinkInfo icon={recommendation.linkPreview.icon} link={recommendation.link} />
        </View>
      </HoliButton>
    </View>
  )
}

export default withProfiler(RecommendationPreview, { name: 'RecommendationPreview' })

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background10,
    padding: Spacing.xxs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  image: {
    borderRadius: 6,
    maxWidth: '100%',
  },
  description: {
    paddingHorizontal: Spacing['3xs'],
  },
})
