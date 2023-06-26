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

interface InsightPreviewBoxProps {
  insight: Insight | 'loading'
  style?: StyleProp<ViewStyle>
}

const InsightPreviewBox: React.VFC<InsightPreviewBoxProps> = ({ insight, ...props }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  if (insight === 'loading') {
    return (
      <View {...props}>
        <HoliSkeleton style={styles.loadingImage} />

        <HoliUserAvatarPile style={styles.avatarPile} users={[]} loading collapse />
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
          <HoliHeading level="3" selectable={true} size="xSmall" style={[styles.cagetory]}>
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
  loadingImage: {
    aspectRatio: 327 / 206,
    borderRadius: 12,
    height: 'auto',
  },
  mainImage: {
    aspectRatio: 327 / 206,
    borderRadius: 12,
    width: '100%',
    backgroundColor: colors.background30,
  },
  cagetory: {
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
