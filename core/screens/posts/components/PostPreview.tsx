import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import PostImage from '@holi/core/screens/posts/components/PostImage'
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

// TODO: remove
const imageUrl = 'https://ipbes.net/sites/default/files/default_images/deliverables-banner-bg_0.jpg'

const PostPreview: React.VFC<PostPreviewProps> = ({ insightId, post, style }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const author = useMemo(() => {
    const { avatar, avatarLabel, avatarDefaultColor } = post.creator
    return {
      name: post.creator.fullName,
      avatarLabel,
      avatarDefaultColor,
      avatar,
    }
  }, [post])

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        <HoliMediaHeader
          title={post.title}
          author={author}
          date={post.created}
          touchHandler={() => navigate(`/insights/${insightId}/posts/${post.id}`)}
          testID="btn-to-post"
        >
          <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
            <HoliIcon icon="more" color={colors.fontColorGrey} />
          </HoliButton>
        </HoliMediaHeader>

        <HoliReadMore numberOfLines={10} fontStyle={styles.readMoreText} style={styles.readMoreContainer}>
          {post.text}
        </HoliReadMore>
      </View>

      {/* TODO: use post image data from BE */}
      <PostImage uri={imageUrl} postTitle={post.title} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundColorWhite,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  readMoreContainer: {
    marginTop: 16,
  },
  readMoreText: {
    color: colors.fontColor,
    lineHeight: 20,
  },
})

export default PostPreview
