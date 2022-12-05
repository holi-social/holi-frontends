import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import LinkPreview from '@holi/core/screens/posts/components/LinkPreview'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import { Post } from '@holi/core/screens/posts/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
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

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        <HoliMediaHeader
          title={post.title}
          author={post.creator}
          date={post.created}
          touchHandler={() => navigate(`/insights/${insightId}/posts/${post.id}`)}
          testID="btn-to-post"
        >
          <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
            <HoliIcon icon="more" color={colors.fontColorGrey} />
          </HoliButton>
        </HoliMediaHeader>

        <HoliReadMore numberOfLines={10} fontStyle={styles.readMoreText} style={styles.readMoreContainer}>
          <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} />
        </HoliReadMore>
      </View>
      <PostImage uri={imageUrl} postTitle={post.title} />
      {!!post.links?.length && (
        <View style={styles.paddingHorizontal}>
          <LinkPreview style={styles.linkPreview} previewData={post.links[0]} label={post.links[0].title} />
        </View>
      )}
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
  linkPreview: {
    marginTop: 16,
    maxWidth: 320,
  },
})

export default PostPreview
