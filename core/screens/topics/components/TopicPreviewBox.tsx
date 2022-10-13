import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Insight } from '@holi/core/screens/insights/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface TopicPreviewBoxProps {
  insight: Insight
  style?: StyleProp<ViewStyle>
}

// TODO: decide on how to work with User Partials
const editorsOfInsight: (insight: Insight) => User[] = (insight) => {
  const editors: User[] = [insight.curator as User]
  insight.posts.forEach((post) => editors.push(post.creator as User))
  // filter empty authors/curators
  return editors.filter((x) => !!x)
}

const TopicPreviewBox: React.VFC<TopicPreviewBoxProps> = ({ insight, ...props }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const editors = editorsOfInsight(insight)

  // TODO: remove dummy image
  // const headerImage = insight.headerImage
  const headerImage = 'https://image.geo.de/30657478/t/5W/v6/w960/r1.5/-/wer-hat-den-foehn-picture-1238735191.jpg'

  return (
    <View {...props}>
      <HoliButton
        label={t('topics.topic.title', { title: insight.title })}
        transparent
        onPress={() => navigate(`/topics/${insight.id}`)}
        testID="feed-topic-image-link"
      >
        <Image source={{ uri: headerImage }} style={styles.mainImage} />

        <HoliHeading level="2" selectable={true}>
          {insight.title}
        </HoliHeading>
      </HoliButton>

      {
        <View style={styles.authorCategoryContainer}>
          <HoliText style={styles.textGrey}>
            <Trans i18nKey="topics.post.author" values={{ author: userFullName(insight.curator), category: '' }} />
            <HoliButton
              label={t('topics.topic.category', { category: 'TBD' })}
              transparent
              inline
              style={mixins.inlineButtonFixDefault}
            >
              <HoliText bold style={styles.textGrey}>
                #{'TBD'}
              </HoliText>
            </HoliButton>
          </HoliText>
        </View>
      }

      {editors.length && <HoliUserAvatarPile users={editors} counter collapse style={{ marginTop: 10 }} />}
    </View>
  )
}

export default TopicPreviewBox

const styles = StyleSheet.create({
  mainImage: {
    aspectRatio: 344 / 218,
    borderRadius: 18,
    marginBottom: 16,
    width: '100%',
    backgroundColor: colors.backgroundColorGreyLight,
  },
  authorCategoryContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  avatar: {
    borderColor: colors.white,
    borderRadius: 24,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  contributorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGrey: {
    color: colors.fontColorGrey,
  },
})
