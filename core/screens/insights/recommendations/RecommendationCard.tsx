import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { Recommendation } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

interface RecommendationCardProps {
  insightId: string
  recommendation: Recommendation
}

const RecommendationCard = ({ recommendation, insightId }: RecommendationCardProps) => {
  const { navigate } = useRouting()

  return (
    <View style={styles.card}>
      <HoliButton
        label={recommendation.linkPreview.title}
        transparent
        onPress={() => navigate(`/insights/${insightId}/recommendations/${recommendation.id}`)}
        testID="feed-insight-image-link"
      >
        {recommendation.linkPreview.image && (
          <>
            <HoliImage
              source={{ uri: recommendation.linkPreview.image }}
              label={recommendation.link}
              style={styles.image}
              resizeMode="cover"
            />
            <HoliGap size="s" />
          </>
        )}
        <View style={styles.description}>
          <ExternalContentCategoryBadge category={recommendation.category} />
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

export default withProfiler(RecommendationCard, { name: 'RecommendationCard' })

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background10,
    padding: Spacing['3xs'],
    borderRadius: Spacing.xs,
    borderWidth: 1,
    borderColor: colors.foreground10,
    flex: 1,
  },
  image: {
    borderRadius: Spacing.xs,
    width: '100%',
    height: 160,
  },
  description: {
    paddingHorizontal: Spacing['3xs'],
  },
})
