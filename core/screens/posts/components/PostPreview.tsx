import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { ContentType } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import { Post } from '@holi/core/screens/posts/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliNavigationLink from '@holi/ui/components/atoms/HoliNavigationLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostPreviewProps = {
  post: Post
  insightId?: string
  style?: StyleProp<ViewStyle>
}

const PostPreview: React.VFC<PostPreviewProps> = ({ post, insightId, style }) => {
  const { t } = useTranslation()
  const commenters = post.commenters.data
  const { visible, show, hide } = useModalState()

  const postUrl = insightId ? `/insights/${insightId}/posts/${post.id}` : `/posts/${post.id}`
  const commentUrl = `${postUrl}/comment`

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.paddingHorizontal}>
        <View style={styles.header}>
          <View style={styles.mediaHeaderLink}>
            <HoliNavigationLink
              href={`/profile/${post.creator.id}`}
              label={post.creator.fullName}
              testID="btn-to-post-creator-profile"
            >
              <HoliMediaHeader title={post.creator.fullName} author={post.creator} date={post.created} />
            </HoliNavigationLink>
          </View>
          <MoreOptionsButtonWithModal
            label={t('insights.post.preview.more')}
            showOptions={visible}
            onPress={show}
            onModalDismiss={hide}
            style={styles.moreButton}
          >
            <ReportBlockOptionButton
              action="report"
              objectId={post.id}
              contentType={ContentType.POST}
              style={styles.moreOptionItem}
              confirmationModalProps={{
                title: t('insights.post.report.confirmation.title'),
                description: t('insights.post.report.confirmation.description'),
              }}
              successMessage={t('global.report.successMessage')}
              onConfirm={hide}
            />
          </MoreOptionsButtonWithModal>
        </View>

        <View style={styles.postTitleLink}>
          <HoliNavigationLink href={postUrl} label={post.title} testID="btn-to-post">
            <HoliHeading size="small" style={styles.postTitle}>
              {post.title}
            </HoliHeading>
          </HoliNavigationLink>
        </View>

        <HoliReadMore numberOfLines={10} fontStyle={styles.readMoreText}>
          <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} size="small" />
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

      <View style={[styles.paddingHorizontal, styles.reactionsBar]}>
        {post.numberOfComments > 0 && (
          <View style={styles.reactionsLink}>
            <HoliNavigationLink href={`${postUrl}?commentId=first`} label={t('insights.posts.comments.link')}>
              <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
                {t('insights.post.response', { count: post.numberOfComments })}
              </HoliUserAvatarPile>
            </HoliNavigationLink>
          </View>
        )}

        {post.numberOfComments < 1 && (
          <View style={styles.noCommentsYetMessage}>
            <HoliNavigationLink href={commentUrl} label={t('insights.posts.comments.create_comment_button')}>
              <HoliText size="small" style={{ color: colors.foreground20 }}>
                {t('insights.post.no-comment-yet')}
              </HoliText>
            </HoliNavigationLink>
          </View>
        )}

        {/* TODO: reactions functionality comes with HOLI-3478 */}
        <HoliReactionsCount
          onPress={() => {
            console.log('click !!!!!')
          }}
          type="post"
          count={0}
          active={false}
          fullName={post.creator.fullName}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background10,
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
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
  postTitleLink: {
    display: 'flex',
  },
  postTitle: {
    color: colors.foreground20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  readMoreText: {
    color: colors.foreground30,
    lineHeight: 20,
  },
  linkPreview: {
    marginTop: 16,
    maxWidth: 320,
  },
  reactionsBar: {
    marginTop: 21,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionsLink: {
    height: 'auto',
    display: 'flex',
  },
  noCommentsYetMessage: {
    paddingRight: 24,
    flex: 1,
    marginTop: Platform.OS === 'web' ? 0 : 4,
  },
})

export default PostPreview
