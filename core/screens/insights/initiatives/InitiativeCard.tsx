import { withProfiler } from '@sentry/react'
import React from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import ExternalContentCategoryBadge from '@holi/core/screens/insights/components/ExternalContentCategoryBadge'
import LinkInfo from '@holi/core/screens/insights/components/LinkInfo'
import { Initiative } from '@holi/core/screens/insights/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

interface InitiativeCardProps {
  insightId: string
  initiative: Initiative
}

const InitiativeCard = ({ initiative, insightId }: InitiativeCardProps) => {
  const { navigate } = useRouting()

  return (
    <Pressable
      onPress={() => navigate(`/insights/${insightId}/initiatives/${initiative.id}`)}
      style={({ hovered }) => {
        return hovered ? [styles.card, styles.hovered] : [styles.card]
      }}
      testID="insight-initiative-image-link"
    >
      <View>
        {initiative.linkPreview.image && (
          <>
            <HoliImage
              source={{ uri: initiative.linkPreview.image }}
              label={initiative.link}
              style={styles.image}
              resizeMode="cover"
            />
            <HoliGap size="s" />
          </>
        )}
        <View style={styles.description}>
          <ExternalContentCategoryBadge category={initiative.category} />
          <HoliGap size="s" />

          {initiative.linkPreview.title && (
            <>
              <HoliHeading level="2" selectable size="s" numberOfLines={3}>
                {initiative.linkPreview.title}
              </HoliHeading>
              <HoliGap size="s" />
            </>
          )}

          <LinkInfo icon={initiative.linkPreview.icon} link={initiative.link} />
        </View>
      </View>
    </Pressable>
  )
}

export default withProfiler(InitiativeCard, { name: 'InitiativeCard' })

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background10,
    padding: Spacing['3xs'],
    borderRadius: Spacing.xs,
    borderWidth: 1,
    borderColor: colors.foreground10,
    flex: 1,
    ...Platform.select({
      web: { marginBottom: 4 },
    }),
  },

  image: {
    borderRadius: Spacing.xs,
    width: '100%',
    height: 160,
  },

  description: {
    paddingHorizontal: Spacing['3xs'],
  },

  hovered: {
    borderColor: colors.black300,
    shadowColor: colors.black300,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
  },
})
