import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Insight } from '@holi/core/screens/insights/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

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

const InsightPreviewBox: React.VFC<InsightPreviewBoxProps> = ({ insight, loading, ...props }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  if (loading) {
    return (
      <View {...props}>
        <HoliSkeleton aspectRatio={327 / 206} borderRadius={16} height={'auto'} width={'100%'} />

        <HoliHeading level="3" selectable={true} size="xSmall" style={styles.topicTitle} loading />

        <HoliHeading level="2" selectable={true} size="small" numberOfLines={3} style={styles.spaceTop} loading />

        <HoliText size="small" style={styles.spaceTop} selectable={true} loading />

        <HoliUserAvatarPile loading usersToShow={3} counter collapse style={styles.avatarPile} />
      </View>
    )
  }

  const editors = insight.involvedUsers.data

  return (
    <View {...props}>
      <HoliButton
        label={t('insights.insight.title', { title: insight.title })}
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

        {!!insight.topic && (
          <HoliHeading level="3" selectable={true} size="xSmall" style={styles.topicTitle}>
            {insight.topic.title}
          </HoliHeading>
        )}

        <HoliHeading level="2" selectable={true} size="small" numberOfLines={3} style={styles.spaceTop}>
          {insight.title}
        </HoliHeading>

        {!!insight.creator && (
          <HoliText size="small" style={[styles.spaceTop, styles.textGrey]} selectable={true}>
            {t('insights.posts.byAuthor', { author: insight.creator.fullName, count: insight.numberOfPosts })}
          </HoliText>
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

export default InsightPreviewBox

const styles = StyleSheet.create({
  mainImage: {
    aspectRatio: 327 / 206,
    borderRadius: 12,
    width: '100%',
    backgroundColor: colors.background30,
  },
  topicTitle: {
    color: colors.brandColorB30,
    marginTop: 16,
  },
  avatarPile: {
    marginTop: 12,
  },
  textGrey: {
    color: colors.foreground20,
  },
  spaceTop: {
    marginTop: 8,
  },
})
