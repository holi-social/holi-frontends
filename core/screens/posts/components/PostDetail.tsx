import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { Post } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type PostDetailProps = {
  post: Post
}

const PostDetail: React.VFC<PostDetailProps> = ({ post }: PostDetailProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const author = post.creator

  return (
    <View style={[mixins.container, styles.postView]}>
      {/* Post title */}
      <View style={styles.header}>
        <HoliHeading level="1" size="medium">
          {post.title}
        </HoliHeading>
        <HoliButton transparent inline label={t('insights.post.preview.more')} style={styles.moreButton}>
          <HoliIcon icon="more" color={colors.fontColorGrey} />
        </HoliButton>
      </View>

      {/* Post creator */}
      <HoliMediaHeader
        title={author.fullName}
        author={author}
        date={post.created}
        boldTitle
        style={styles.mediaHeader}
      />

      <HoliText style={styles.body}>{post.text}</HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  postView: {
    paddingTop: 12,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaHeader: {
    marginTop: 20,
  },
  body: {
    marginTop: 16,
    lineHeight: 22,
  },
})

export default PostDetail
