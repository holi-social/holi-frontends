import { Text } from 'holi-bricks/components/text'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import ImagePreview from '@holi/core/screens/individualPosts/components/ImagePreview'
import { Spacing } from 'holi-bricks/tokens'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS } from '@holi/icons/src/generated'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import type { Insight } from '@holi/core/screens/insights/types'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import type { User } from '@holi/core/domain/shared/types'
import { Avatar } from 'holi-bricks/components/avatar'
import { HoliButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'

type InsightCardProps = {
  insight: Insight
  creators: User[]
  style?: StyleProp<ViewStyle>
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, creators, style }: InsightCardProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const date =
    getRelativeDateString(insight.datePublished, i18n.language).charAt(0).toUpperCase() +
    getRelativeDateString(insight.datePublished, i18n.language).slice(1)

  const editors = insight.involvedUsers.data

  return (
    <View style={[styles.container, style]} testID="insight-card">
      <HoliLink label={insight.title} href={'/insights'}>
        <View style={styles.header}>
          <Text size="lg">{t('homeFeed.insights.card.heading')}</Text>
          <View style={styles.seeMore}>
            <Text size="xs">{t('global.seeMore')}</Text>
            <HoliIcon icon={ArrowRightS} size={16} />
          </View>
        </View>
      </HoliLink>
      <HoliButtonTracked
        label={insight.title}
        transparent
        onPress={() => navigate(`/insights/${insight.id}`)}
        testID="feed-insight-image-link"
        trackingEvent={TrackingEvent.InsightCard.CardPressed(insight.id)}
      >
        <View style={styles.content}>
          <View style={styles.creators}>
            <HoliUserAvatarPile users={creators} collapse loading={false} usersToShow={3} />
            <Text size="xxs">{t('insight.page.curatedBy')}</Text>
          </View>
          <ImagePreview currentImage={insight.headerImage} />
          <Text size="lg">{insight.title}</Text>
          {insight.creator && (
            <View style={styles.creatorRow}>
              <Avatar
                size="xs"
                imgSrc={insight.creator.avatar}
                imgPlaceholder={insight.creator.avatarBlurhash}
                label={insight.creator.fullName || t('user.profileView.anonymous')}
                testID="insight-curator"
                initials={insight.creator.avatarLabel}
              />

              <Text size="xs">{insight.creator.fullName}</Text>
              <Text size="lg">&middot;</Text>
              <Text size="xs">{date}</Text>
            </View>
          )}
          {!!editors.length && (
            <HoliUserAvatarPile
              users={[...editors]}
              usersToShow={3}
              usersTotal={insight.involvedUsers.totalResults}
              counter
              collapse
              style={styles.avatarPile}
            />
          )}
        </View>
      </HoliButtonTracked>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      borderColor: theme.colors.gray200,
      borderWidth: 1,
    },
    creators: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
    header: {
      gap: Spacing['xxs'],
      paddingHorizontal: Spacing.xs,
      paddingTop: Spacing.xs,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      paddingHorizontal: Spacing.xs,
      paddingTop: Spacing['3xs'],
      paddingBottom: Spacing.xs,
      gap: Spacing['xxs'],
    },
    seeMore: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
    avatarPile: {
      marginTop: Spacing['4xs'],
    },
  })

export default InsightCard
