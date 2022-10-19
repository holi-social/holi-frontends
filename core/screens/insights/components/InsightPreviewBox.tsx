import { faker } from '@faker-js/faker'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Insight } from '@holi/core/screens/insights/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

interface InsightPreviewBoxProps {
  insight: Insight
  style?: StyleProp<ViewStyle>
}

// TODO: decide on how to work with User Partials
const editorsOfInsight = (insight: Insight) =>
  [insight.curator, ...insight.posts.map(({ creator }) => creator)]
    .filter((user) => !!user)
    .map((user) => (!user.avatar ? { ...user, avatar: faker.image.avatar() } : user)) // TODO: remove, use real avatar instead of dummy image

const InsightPreviewBox: React.VFC<InsightPreviewBoxProps> = ({ insight, ...props }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const editors = editorsOfInsight(insight)

  // TODO: remove dummy image
  // const headerImage = insight.headerImage
  const headerImage = 'https://image.geo.de/30657478/t/5W/v6/w960/r1.5/-/wer-hat-den-foehn-picture-1238735191.jpg'

  return (
    <View {...props}>
      <HoliButton
        label={t('insights.insight.title', { title: insight.title })}
        transparent
        onPress={() => navigate(`/insights/${insight.id}`)}
        testID="feed-insight-image-link"
      >
        <Image source={{ uri: headerImage }} style={styles.mainImage} />

        <HoliHeading level="3" selectable={true} size="xSmall" style={[styles.cagetory]}>
          {/* TODO: provide real category */}
          Immigration
        </HoliHeading>

        <HoliHeading level="2" selectable={true} size="small" style={styles.spaceTop}>
          {insight.title}
        </HoliHeading>

        <HoliText size="small" style={[styles.spaceTop, styles.textGrey]} selectable={true}>
          {t('insights.posts.byAuthor', { author: userFullName(insight.curator), count: insight.posts.length })}
        </HoliText>

        {editors.length && <HoliUserAvatarPile users={editors} counter collapse style={styles.avatarPile} />}
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
