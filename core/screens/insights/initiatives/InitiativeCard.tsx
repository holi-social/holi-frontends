import { withProfiler } from '@sentry/react'
import React, { useMemo, useState } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import InsightReactions, { ItemType } from '@holi/core/screens/insights/InsightReactions'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import useInitiativeLinkNavigation from '@holi/core/screens/insights/initiatives/useInitiativeLinkNavigation'
import type { Initiative } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import Spacing from '@holi/ui/foundations/Spacing'
import { Image } from 'holi-bricks/components/image'
import { Text } from 'holi-bricks/components/text'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Stack } from 'holi-bricks/components/stack'
import ReactionCount from '@holi/core/components/reactions/ReactionCount'

interface InitiativeCardProps {
  insightId: string
  initiative: Initiative
}

const InitiativeCard = ({ initiative, insightId }: InitiativeCardProps) => {
  const [errorLoadingImage, setErrorLoadingImage] = useState(false)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { navigate } = useInitiativeLinkNavigation(initiative, insightId)

  return (
    <Pressable
      onPress={navigate}
      style={({ hovered }) => {
        return hovered ? [styles.card, styles.hovered] : [styles.card]
      }}
      testID="feed-insight-image-link"
    >
      <View style={styles.content}>
        {!errorLoadingImage && initiative.linkPreview.image && (
          <View style={styles.imageWrapper}>
            <Image
              source={initiative.linkPreview.image}
              alt={initiative.link}
              height={160}
              width={400}
              resizeMode="cover"
              onError={() => setErrorLoadingImage(true)}
              stretch
            />
          </View>
        )}
        {(errorLoadingImage || !initiative.linkPreview.image) && (
          <View style={styles.imageWrapper}>
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_link_preview_empty.svg')}
              alt={initiative.link}
              width={88}
              height={88}
            />
          </View>
        )}
        <View>
          <ExternalContentCategoryBadge category={initiative.category} />
          <HoliGap size="s" />

          {initiative.linkPreview.title && (
            <Text headingLevel="2" size="lg" numberOfLines={3} margin={{ bottom: 'sm' }}>
              {initiative.linkPreview.title}
            </Text>
          )}

          <LinkInfo icon={initiative.linkPreview.icon} link={initiative.link} />
        </View>
      </View>
      <Stack direction="row" justifyContent="space-between" margin={{ top: 'xs' }}>
        <ReactionCount count={initiative.reactions.HEART} />
        <InsightReactions item={initiative} itemType={ItemType.INITIATIVE} />
      </Stack>
    </Pressable>
  )
}

export default withProfiler(InitiativeCard, { name: 'InitiativeCard' })

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
