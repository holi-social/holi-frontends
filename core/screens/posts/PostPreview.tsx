import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { fullName } from '@holi/core/helpers'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Post } from '@holi/core/screens/posts/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

export type PostPreviewProps = {
  insightId: string
  post: Post
  style?: StyleProp<ViewStyle>
}

const PostPreview: React.VFC<PostPreviewProps> = ({ insightId, post, style }) => {
  const { navigate } = useRouting()
  const { t, i18n } = useTranslation()

  const creatorName = fullName(post.creator.firstName, post.creator.lastName)

  const date = useMemo(() => getRelativeDateString(post.created, i18n.language), [post, i18n.language])

  const capitalizeDate = (date: string) => date.charAt(0).toUpperCase() + date.slice(1)

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.header}>
        <HoliUserAvatar
          imageSrc={post.creator.avatar}
          label={creatorName}
          initials={post.creator.avatarLabel || ''}
          defaultColor={post.creator.avatarDefaultColor || ''}
          size="small"
        />
        <View style={styles.titleContainer}>
          <HoliButton
            transparent
            label={post.title}
            onPress={() => navigate(`/insights/${insightId}/posts/${post.id}`)}
          >
            <HoliText>{post.title}</HoliText>
          </HoliButton>
          <HoliText size="small" style={styles.date}>
            {capitalizeDate(date)}
          </HoliText>
        </View>
        <HoliButton transparent inline label={t('insights.post.preview.options')} style={styles.optionsButton}>
          <HoliIcon icon="options" size={12} color={colors.fontColorGrey} />
        </HoliButton>
      </View>

      <HoliReadMore numberOfLines={10} fontStyle={styles.text}>
        {post.text}
      </HoliReadMore>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { padding: 24, borderRadius: 12, backgroundColor: colors.backgroundColorWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    flex: 1,
  },
  date: {
    marginTop: 4,
    color: colors.fontColorGrey,
  },
  optionsButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  text: {
    color: colors.fontColor,
    lineHeight: 20,
  },
})

export default PostPreview
