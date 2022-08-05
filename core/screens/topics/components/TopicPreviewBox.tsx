import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface TopicPreviewBoxProps {
  id: string
  title: string
  author: string
  image: {
    src: string
  }
  editors: User[]
  style?: StyleProp<ViewStyle>
  category: string
}

const TopicPreviewBox: React.VFC<TopicPreviewBoxProps> = ({
  id,
  title,
  image,
  author,
  editors,
  category,
  ...props
}) => {
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = topicPreviewBoxStyles(theme)
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <View {...props}>
      <HoliButton
        label={t('topics.topic.title', { title })}
        transparent
        onPress={() => navigate(`/topics/${id}`)}
        style={styles.mainImageContainer}
        testID="feed-topic-image-link"
      >
        <Image source={{ uri: image.src }} style={styles.mainImage} />

        <HoliHeading level="2" selectable={true}>
          {title}
        </HoliHeading>
      </HoliButton>

      <View style={styles.authorCategoryContainer}>
        <HoliText style={styles.textGrey}>
          <Trans i18nKey="topics.post.author" values={{ author, category: '' }} />
        </HoliText>
        <HoliButton label={t('topics.topic.category', { category })} transparent inline>
          <HoliText bold style={styles.textGrey}>
            #{category}
          </HoliText>
        </HoliButton>
      </View>

      {editors.length && <HoliUserAvatarPile users={editors} counter collapse />}
    </View>
  )
}

export default TopicPreviewBox

const topicPreviewBoxStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    mainImageContainer: {
      marginBottom: 16,
    },
    mainImage: {
      aspectRatio: 344 / 218,
      borderRadius: 18,
      marginBottom: 16,
      width: '100%',
    },
    authorCategoryContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    textGrey: {
      color: theme.colors.fontColorGrey,
    },
  })
