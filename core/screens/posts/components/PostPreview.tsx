import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliLink from '@holi//ui/components/molecules/HoliLink'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import { Post } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliMoreOptions from '@holi/ui/components/organisms/HoliMoreOptions'
import HoliOptionItem from '@holi/ui/components/organisms/HoliOptionItem'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostPreviewProps = {
  post: Post
  style?: StyleProp<ViewStyle>
}

const PostPreview: React.VFC<PostPreviewProps> = ({ post, style }) => {
  const { t } = useTranslation()
  const commenters = post.commenters.data

  const [optionsVisible, setOptionsVisible] = useState(false)

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        <View style={styles.header}>
          <HoliLink
            href={`/profile/${post.creator.id}`}
            label={post.creator.fullName}
            testID="btn-to-post-creator-profile"
            style={styles.mediaHeaderLink}
          >
            <HoliMediaHeader title={post.creator.fullName} author={post.creator} date={post.created} />
          </HoliLink>

          <HoliMoreOptions
            label={t('insights.post.preview.more')}
            style={styles.moreButton}
            showOptions={optionsVisible}
            onVisibilityChange={setOptionsVisible}
          >
            <HoliOptionItem
              label={t('global.report')}
              icon="close-circle"
              tintColor={colors.fontColorError}
              contentStyle={styles.moreOptionItem}
              onPress={() => setOptionsVisible(false)}
            />
          </HoliMoreOptions>
        </View>

        <HoliLink href={`/posts/${post.id}`} label={post.title} textStyle={styles.postTitleLink} testID="btn-to-post">
          <HoliHeading size="small" style={styles.postTitle}>
            {post.title}
          </HoliHeading>
        </HoliLink>

        <HoliReadMore numberOfLines={10} fontStyle={styles.readMoreText}>
          <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} />
        </HoliReadMore>
      </View>

      {post.image && (
        <PostImage uri={post.image.url} height={post.image.height} width={post.image.width} postTitle={post.title} />
      )}

      {!!post.links?.length && (
        <View style={styles.paddingHorizontal}>
          <HoliLinkPreview style={styles.linkPreview} previewData={post.links[0]} label={post.links[0].title} />
        </View>
      )}

      {post.numberOfComments > 0 && (
        <View style={[styles.paddingHorizontal, styles.commentsPile]}>
          <HoliLink href={`/posts/${post.id}?commentId=first`} label={t('insights.posts.comments.link')}>
            <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
              {t('insights.post.response', { count: post.numberOfComments })}
            </HoliUserAvatarPile>
          </HoliLink>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorWhite,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
  },
  mediaHeaderLink: {
    flexShrink: 1,
    flexGrow: 1,
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  postTitleLink: {
    display: 'flex',
  },
  postTitle: {
    color: colors.fontColorGrey,
    paddingTop: 16,
    paddingBottom: 8,
  },
  readMoreText: {
    color: colors.fontColor,
    lineHeight: 20,
  },
  linkPreview: {
    marginTop: 16,
    maxWidth: 320,
  },
  commentsPile: {
    marginTop: 20,
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
})

export default PostPreview
