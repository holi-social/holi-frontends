import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import type { Insight, Recommendation } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'

import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Stack } from 'holi-bricks/components/stack'
import ReactionCount from '@holi/core/components/reactions/ReactionCount'

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
      <View style={styles.content}>
        {!errorLoadingImage && recommendation.linkPreview.image && (
          <View style={styles.imageWrapper}>
            <Image
              source={recommendation.linkPreview.image}
              alt={recommendation.link}
              height={160}
              width={200}
              resizeMode="cover"
              onError={() => setErrorLoadingImage(true)}
              stretch
            />
          </View>
        )}
        {(errorLoadingImage || !recommendation.linkPreview.image) && (
          <View style={styles.imageWrapper}>
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_link_preview_empty.svg')}
              alt={recommendation.link}
              width={88}
              height={88}
            />
          </View>
        )}
        <View>
          <ExternalContentCategoryBadge category={recommendation.category} />
          <HoliGap size="s" />

          {recommendation.linkPreview.title && (
            <Text headingLevel="2" size="lg" numberOfLines={3} margin={{ bottom: 'sm' }}>
              {recommendation.linkPreview.title}
            </Text>
          )}
          <LinkInfo icon={recommendation.linkPreview.icon} link={recommendation.link} />
        </View>
      </View>
      <Stack direction="row" justifyContent="space-between" margin={{ top: 'xs' }}>
        <ReactionCount count={recommendation.reactions.HEART} />
        <InsightReactions item={recommendation} itemType={ItemType.RECOMMENDATION} />
      </Stack>
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
    content: {
      flexGrow: 1,
    },
    imageWrapper: {
      borderRadius: Spacing['3xs'],
      width: '100%',
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.gray100,
      marginBottom: Spacing.xs,
      overflow: 'hidden',
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
  })
