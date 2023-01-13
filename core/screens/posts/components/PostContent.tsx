import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliLink from '@holi//ui/components/molecules/HoliLink'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import { Post } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostContentProps = {
  post: Post
  hasHeader?: boolean
  collapseContent?: boolean
  minimized?: boolean
  onMediaHeaderPressed?: () => void
  commentsAvatarPileLink?: string | boolean
  style?: StyleProp<ViewStyle>
}

const PostContent: React.VFC<PostContentProps> = ({
  post,
  hasHeader,
  minimized,
  collapseContent,
  onMediaHeaderPressed,
  commentsAvatarPileLink,
  style,
}) => {
  const { t } = useTranslation()
  const commenters = post.commenters.data

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  const commentersAvatarPile = (
    <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
      {t('insights.post.response', { count: post.numberOfComments })}
    </HoliUserAvatarPile>
  )

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        {hasHeader && (
          <View style={styles.header}>
            <HoliHeading level="1" size="medium">
              {post.title}
            </HoliHeading>
            <HoliButton
              transparent
              inline
              label={t('insights.post.preview.more')}
              style={styles.moreButton}
              onPress={showFeatureNotImplementedToast}
            >
              <HoliIcon icon="more" color={colors.fontColorGrey} />
            </HoliButton>
          </View>
        )}

        <HoliMediaHeader
          title={hasHeader ? post.creator.fullName : post.title}
          author={post.creator}
          date={post.created}
          touchHandler={onMediaHeaderPressed}
          testID="btn-to-post"
        >
          {!hasHeader && (
            <HoliButton
              transparent
              inline
              label={t('insights.post.preview.more')}
              style={styles.moreButton}
              onPress={showFeatureNotImplementedToast}
            >
              <HoliIcon icon="more" color={colors.fontColorGrey} />
            </HoliButton>
          )}
        </HoliMediaHeader>

        {collapseContent ? (
          <HoliReadMore numberOfLines={10} fontStyle={styles.readMoreText} style={styles.description}>
            <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} />
          </HoliReadMore>
        ) : (
          <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} style={styles.description} />
        )}
      </View>

      {!minimized && (
        <>
          {post.image && (
            <PostImage
              uri={post.image.url}
              height={post.image.height}
              width={post.image.width}
              postTitle={post.title}
            />
          )}

          {!!post.links?.length && (
            <View style={styles.paddingHorizontal}>
              <HoliLinkPreview style={styles.linkPreview} previewData={post.links[0]} label={post.links[0].title} />
            </View>
          )}

          {!!post.numberOfComments && (
            <View style={[styles.paddingHorizontal, styles.commentsPile]}>
              {commentsAvatarPileLink ? (
                <HoliLink
                  href={
                    typeof commentsAvatarPileLink === 'string'
                      ? commentsAvatarPileLink
                      : `/posts/${post.id}?commentId=first`
                  }
                  label={t('insights.posts.comments.link')}
                >
                  {commentersAvatarPile}
                </HoliLink>
              ) : (
                <>{commentersAvatarPile}</>
              )}
            </View>
          )}
        </>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  description: {
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
  commentsPile: {
    marginTop: 20,
  },
})

export default PostContent
