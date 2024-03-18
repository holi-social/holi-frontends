import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { Insight, Recommendation } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface RecommendationCardProps {
  insight: Insight
  recommendation: Recommendation
}

const RecommendationCard = ({ recommendation, insight }: RecommendationCardProps) => {
  const [errorLoadingImage, setErrorLoadingImage] = useState(false)
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <Pressable
      onPress={() => navigate(`/insights/${insight.id}/recommendations/${recommendation.id}`)}
      style={({ hovered }) => {
        return hovered ? [styles.card, styles.hovered] : [styles.card]
      }}
      testID="feed-insight-image-link"
    >
      <View>
        {!errorLoadingImage && recommendation.linkPreview.image && (
          <>
            <HoliImage
              source={{ uri: recommendation.linkPreview.image }}
              label={recommendation.link}
              style={styles.image}
              resizeMode="cover"
              onError={() => setErrorLoadingImage(true)}
            />
            <HoliGap size="s" />
          </>
        )}
        {(errorLoadingImage || !recommendation.linkPreview.image) && (
          <>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_link_preview_empty.svg')}
              label={recommendation.link}
              style={styles.image}
              width={89}
              height={88}
              isSvg
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
          <InsightReactions item={recommendation} itemType={ItemType.RECOMMENDATION} style={styles.reaction} />
          <LinkInfo icon={recommendation.linkPreview.icon} link={recommendation.link} />
        </View>
      </View>
    </Pressable>
  )
}

export default withProfiler(RecommendationCard, { name: 'RecommendationCard' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background10,
      padding: Spacing['3xs'],
      borderRadius: Spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      flex: 1,
      ...Platform.select({
        web: { marginBottom: 4 },
      }),
    },
    image: {
      borderRadius: Spacing.xs,
      width: '100%',
      height: 160,
      backgroundColor: theme.colors.gray100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    description: {
      paddingHorizontal: Spacing['3xs'],
    },
    hovered: {
      borderColor: theme.colors.black300,
      shadowColor: theme.colors.black300,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.12,
    },
    reaction: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  })
