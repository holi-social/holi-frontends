import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { Recommendation } from '@holi/core/screens/insights/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LinkM } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBadge from '@holi/ui/components/molecules/HoliBadge'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

interface RecommendationPreviewProps {
  recommendation: Recommendation
}

const RecommendationCard: React.FC<RecommendationPreviewProps> = ({ recommendation }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.card}>
      <HoliButton
        label={recommendation.linkPreview.title}
        transparent
        onPress={() => Linking.openURL(recommendation.link)}
        testID="feed-insight-image-link"
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
          <HoliBadge textSize="extrasmall">
            {t(`insights.recommendations.category.${recommendation.category.toLowerCase()}`)}
          </HoliBadge>
          <HoliGap size="s" />

          {recommendation.linkPreview.title && (
            <>
              <HoliHeading level="2" selectable size="s" numberOfLines={3}>
                {recommendation.linkPreview.title}
              </HoliHeading>
              <HoliGap size="s" />
            </>
          )}

          <View style={styles.link}>
            {!!recommendation.linkPreview.icon && (
              <HoliImage
                source={{ uri: recommendation.linkPreview.icon }}
                label={recommendation.linkPreview.title}
                style={styles.favicon}
              />
            )}
            {!recommendation.linkPreview.icon && (
              <View style={[styles.favicon, styles.missingFavicon]}>
                <HoliIcon icon={LinkM} size={18} color={colors.brandB300} />
              </View>
            )}
            <HoliText numberOfLines={1} size="small" style={styles.linkText}>
              {recommendation.link}
            </HoliText>
          </View>
        </View>
      </HoliButton>
    </View>
  )
}

export default withProfiler(RecommendationCard, { name: 'RecommendationPreview' })

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
    borderRadius: 6,
    maxWidth: '100%',
  },
  description: {
    paddingHorizontal: Spacing['3xs'],
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3xs'],
  },
  linkText: {
    flex: 1,
  },
  favicon: {
    height: 24,
    width: 24,
    borderRadius: 4,
  },
  missingFavicon: {
    backgroundColor: colors.brandB100,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
