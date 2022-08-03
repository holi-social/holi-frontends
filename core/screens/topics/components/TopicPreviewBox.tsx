import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

// TODO: adjust this dummy interface to real props
interface TopicPreviewBoxProps {
  id: string
  title: string
  author: string
  image: {
    src: string
  }
  contributors: User[]
  style?: ViewStyle | ViewStyle[] | Record<string, unknown>
  category: string
}

const TopicPreviewBox: React.VFC<TopicPreviewBoxProps> = ({
  id,
  title,
  image,
  author,
  contributors,
  category,
  ...props
}) => {
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = topicPreviewBoxStyles(theme)
  const { t } = useTranslation()

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
          <HoliText bold style={[styles.textGrey]}>
            #{category}
          </HoliText>
        </HoliButton>
      </View>

      <HoliButton
        label={t('topics.topic.topicEditors', { title })}
        transparent
        onPress={() => navigate(`/topics/${id}`)}
        testID="feed-topic-contributors-link"
      >
        <HoliUserAvatarPile users={contributors} counter collapse />
      </HoliButton>
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
    avatar: {
      borderColor: theme.colors.white,
      borderRadius: 24,
      borderWidth: 2,
      height: 24,
      width: 24,
    },
    contributorsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contributorsCounter: {
      marginLeft: 8,
    },
    textGrey: {
      color: theme.colors.fontColorGrey,
    },
  })
