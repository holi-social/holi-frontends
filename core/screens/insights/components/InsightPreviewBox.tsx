import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Insight } from '@holi/core/screens/insights/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface BaseProps {
  style?: StyleProp<ViewStyle>
}
interface SkeletonProps extends BaseProps {
  loading: true
  insight?: Insight
}
interface Props extends BaseProps {
  loading?: false
  insight: Insight
}

type InsightPreviewBoxProps = SkeletonProps | Props

const InsightPreviewBox: React.FC<InsightPreviewBoxProps> = ({ insight, loading, ...props }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  if (loading) {
    return (
      <View {...props}>
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
      <HoliButton
        label={insight.title}
        transparent
        onPress={() => navigate(`/insights/${insight.id}`)}
        testID="feed-insight-image-link"
      >
        <HoliImage
          source={{ uri: insight.headerImage }}
          blurhash={insight.headerImageBlurhash}
          label={insight.title}
          style={styles.mainImage}
        />
        <HoliGap size="s" />

        {!!insight.topic && (
          <HoliBox padding={[0, 0, 8, 0]}>
            <HoliText size="small" bold selectable style={{ color: colors.brandB300 }}>
              {insight.topic.title}
            </HoliText>
          </HoliBox>
        )}

        <HoliHeading level="2" selectable size="s" numberOfLines={3}>
          {insight.title}
        </HoliHeading>

        {!!insight.creator && (
          <HoliBox padding={[8, 0, 0, 0]}>
            <HoliText size="small" style={styles.textGrey} selectable>
              {t('insights.posts.byAuthor', { author: insight.creator.fullName, count: insight.numberOfPosts })}
            </HoliText>
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
      </HoliButton>
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
    avatarPile: {
      marginTop: 12,
    },
    textGrey: {
      color: theme.colors.foreground20,
    },
  })
