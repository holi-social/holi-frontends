import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { fullName } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Post } from '@holi/core/screens/posts/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

export type PostPreviewProps = {
  insightId: string
  post: Post
  style?: StyleProp<ViewStyle>
}

const PostPreview: React.VFC<PostPreviewProps> = ({ insightId, post, style }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const author = useMemo(() => {
    const { avatar, avatarLabel, avatarDefaultColor } = post.creator
    return {
      name: fullName(post.creator.firstName, post.creator.lastName),
      avatarLabel,
      avatarDefaultColor,
      avatar,
    }
  }, [post])

  return (
    <View style={[styles.wrapper, style]}>
      <HoliMediaHeader
        title={post.title}
        author={author}
        date={post.created}
        touchHandler={() => navigate(`/insights/${insightId}/posts/${post.id}`)}
      >
        <HoliButton transparent inline label={t('insights.post.preview.options')} style={styles.optionsButton}>
          <HoliIcon icon="options" size={12} color={colors.fontColorGrey} />
        </HoliButton>
      </HoliMediaHeader>

      <HoliReadMore numberOfLines={10} fontStyle={styles.text}>
        {post.text}
      </HoliReadMore>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { padding: 24, borderRadius: 12, backgroundColor: colors.backgroundColorWhite },
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
