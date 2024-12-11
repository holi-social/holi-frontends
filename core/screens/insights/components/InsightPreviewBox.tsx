import { withProfiler } from '@sentry/react'
import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { HoliButtonTracked } from '@holi/core/components/Trackable'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import type { Insight } from '@holi/core/screens/insights/types'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard from '@holi/ui/components/molecules/HoliCard'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { Spacing } from 'holi-bricks/tokens'

interface Props {
  insight: Insight
  style?: StyleProp<ViewStyle>
}

const InsightPreviewBox: React.FC<PropsWithSkeleton<Props>> = ({ insight, loading, ...props }) => {
  const { navigate } = useRouting()
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  if (loading) {
    return (
      <View {...props} style={StyleSheet.flatten([styles.skeletonWrapper, props.style])}>
        <HoliSkeleton aspectRatio={327 / 206} borderRadius={16} height={'auto'} width={'100%'} />

        <HoliGap size="s" />
        <HoliText size="small" selectable style={{ color: colors.brandB300 }} loading />

        <HoliGap size="xs" />
        <HoliHeading level="2" selectable size="s" numberOfLines={3} loading skeletonOptions={{ numberOfLines: 2 }} />

        <HoliGap size="xs" />
        <HoliText size="small" selectable loading />

        <HoliUserAvatarPile loading usersToShow={3} counter collapse style={styles.avatarPile} />
      </View>
    )
  }

  const editors = insight.involvedUsers.data

  return (
    <View {...props}>
      <HoliButtonTracked
        label={insight.title}
        transparent
        onPress={() => navigate(`/insights/${insight.id}`)}
        testID="feed-insight-image-link"
        trackingEvent={TrackingEvent.InsightCard.CardPressed(insight.id)}
      >
        <HoliCard
          imageLabel={insight.title}
          imageUri={insight.headerImage}
          imageWidth={327}
          imageHeight={218}
          imageAspectRatio={1.75}
          hasBorder
        >
          {!!insight.topic && (
            <View style={{ paddingBottom: 8 }}>
              <ChipLabel size="sm" color="green">
                {insight.topic.title}
              </ChipLabel>
            </View>
          )}

          <HoliHeading level="2" selectable size="s" numberOfLines={3}>
            {insight.title}
          </HoliHeading>

          {!!insight.creator && (
            <HoliBox padding={[8, 0, 0, 0]}>
              <View style={styles.container}>
                <View style={styles.row}>
                  <Avatar
                    size="xs"
                    imgSrc={insight.creator.avatar}
                    imgPlaceholder={insight.creator.avatarBlurhash}
                    label={insight.creator.fullName || t('user.profileView.anonymous')}
                    testID="insight-curator"
                    initials={insight.creator.avatarLabel}
                  />
                  <View style={styles.creatorInfo}>
                    <HoliText size="small" style={styles.textGrey}>
                      {insight.creator.fullName}
                    </HoliText>
                    <HoliText size="large" style={styles.dot}>
                      &middot;
                    </HoliText>
                    <HoliText size="small" style={styles.textGrey}>
                      {getRelativeDateString(insight.datePublished, i18n.language)}
                    </HoliText>
                  </View>
                </View>
              </View>
            </HoliBox>
          )}

          {!!editors.length && (
            <HoliUserAvatarPile
              users={editors}
              usersToShow={3}
              usersTotal={insight.involvedUsers.totalResults}
              counter
              collapse
              style={styles.avatarPile}
            />
          )}
        </HoliCard>
      </HoliButtonTracked>
    </View>
  )
}

export default withProfiler(InsightPreviewBox, { name: 'InsightPreviewBox' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    mainImage: {
      aspectRatio: 327 / 206,
      borderRadius: 12,
      width: '100%',
      backgroundColor: theme.colors.background30,
    },
    dot: {
      color: theme.colors.brandB300,
      marginRight: 4,
      marginLeft: 4,
    },
    avatarPile: {
      marginTop: 12,
    },
    textGrey: {
      color: theme.colors.foreground20,
    },
    container: {
      flex: 1,
    },
    creatorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
    },
    skeletonWrapper: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.gray200,
      padding: 8,
      paddingBottom: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.background10,
    },
  })
