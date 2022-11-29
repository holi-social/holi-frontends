import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Insight } from '@holi/core/screens/insights/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

interface InsightPreviewBoxProps {
  insight: Insight
  style?: StyleProp<ViewStyle>
}

const editorsOfInsight = (insight: Insight) => {
  const editors = [insight.creator, ...insight.posts.map(({ creator }) => creator)]

  // remove duplicates
  return editors.filter((user, index, self) => !!user && self.findIndex((editor) => editor.id === user.id) === index)
}

const InsightPreviewBox: React.VFC<InsightPreviewBoxProps> = ({ insight, ...props }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const editors = editorsOfInsight(insight)

  return (
    <View {...props}>
      <HoliButton
        label={t('insights.insight.title', { title: insight.title })}
        transparent
        onPress={() => navigate(`/insights/${insight.id}`)}
        testID="feed-insight-image-link"
      >
        <HoliImage source={{ uri: insight.headerImage }} label={insight.title} style={styles.mainImage} />

        {insight.topic && (
          <HoliHeading level="3" selectable={true} size="xSmall" style={[styles.cagetory]}>
            {insight.topic.title}
          </HoliHeading>
        )}

        <HoliHeading level="2" selectable={true} size="small" numberOfLines={3} style={styles.spaceTop}>
          {insight.title}
        </HoliHeading>

        <HoliText size="small" style={[styles.spaceTop, styles.textGrey]} selectable={true}>
          {t('insights.posts.byAuthor', { author: insight.creator.fullName, count: insight.posts.length })}
        </HoliText>

        {editors.length && (
          <HoliUserAvatarPile users={editors} usersToShow={3} counter collapse style={styles.avatarPile} />
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
    backgroundColor: colors.backgroundColorGreyLight,
  },
  cagetory: {
    color: colors.fontColorHighlighted,
    marginTop: 16,
  },
  avatarPile: {
    marginTop: 12,
  },
  textGrey: {
    color: colors.fontColorGrey,
  },
  spaceTop: {
    marginTop: 8,
  },
})
