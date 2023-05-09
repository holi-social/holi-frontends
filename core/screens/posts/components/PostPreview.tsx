import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import ActionDrawer from '@holi/core/components/ActionDrawer'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import { ContentType } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import { Post } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliColumn from '@holi/ui/components/atoms/HoliColumn'
import HoliColumns from '@holi/ui/components/atoms/HoliColumns'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { colors } from '@holi/ui/styles/globalVars'

export type PostPreviewProps = {
  post: Post
  insightId?: string
  spaceIdOrName?: string
  hasVisibilityIcon?: boolean
}

const PostPreview = ({ hasVisibilityIcon, insightId, post, spaceIdOrName }: PostPreviewProps) => {
  const { isLoggedIn } = useLoggedInUser()
  const { t } = useTranslation()
  const { openLoginModal } = useLoginModal()

  const commenters = post.commenters.data
  const { visible, show, hide } = useModalState()

  const visibilityIcon = post.isPublic ? 'global' : 'lock'
  const visibilityIconText = post.isPublic ? t('spaces.updates.filter.public') : t('spaces.updates.filter.members')

  const commentUrl = `${getPostUrl(post.id, insightId, spaceIdOrName)}/comment`

  const onPressCommentLink = () => {
    if (!isLoggedIn) {
      openLoginModal()
      // return false prevents link execution
      return false
    }
  }

  return (
    <View style={styles.container}>
      {hasVisibilityIcon ? (
        <HoliColumns alignItems="center" padding={[0, 0, 16, 0]}>
          <HoliIcon icon={visibilityIcon} size={12} filled={true} />
          <HoliBox padding={[0, 0, 0, 6]}>
            <HoliText size="extrasmall">{visibilityIconText}</HoliText>
          </HoliBox>
        </HoliColumns>
      ) : null}

      <HoliColumns>
        <HoliColumn flex={2}>
          <HoliLink
            href={`/profile/${post.creator.id}`}
            label={post.creator.fullName}
            testID="btn-to-post-creator-profile"
          >
            <HoliMediaHeader title={post.creator.fullName} author={post.creator} date={post.created} boldTitle />
          </HoliLink>
        </HoliColumn>
        <HoliColumn>
          <ActionDrawer.Drawer
            label={t('insights.post.preview.more')}
            showOptions={visible}
            onPress={show}
            onModalDismiss={hide}
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
          </ActionDrawer.Drawer>
        </HoliColumn>
      </HoliColumns>

      {post.title && (
        <View style={styles.postTitleLink}>
          <HoliLink href={getPostUrl(post.id, insightId, spaceIdOrName)} label={post.title} testID="btn-to-post">
            <HoliHeading level="3" size="small">
              {post.title}
            </HoliHeading>
          </HoliLink>
        </View>
      )}

      <HoliReadMore numberOfLines={10} color="gray300" bold={false}>
        <HoliRichTextOutput text={post.text} users={post.mentions} links={post.links} size="default" color="gray300" />
      </HoliReadMore>

      {post.image && (
        <PostImage uri={post.image.url} height={post.image.height} width={post.image.width} postTitle={post.title} />
      )}

      {!!post.links?.length && (
        <HoliLinkPreview style={styles.linkPreview} previewData={post.links[0]} label={post.links[0].title} />
      )}

      <View style={styles.reactionsBar}>
        {post.numberOfComments > 0 ? (
          <View style={styles.reactionsLink}>
            <HoliLink
              href={`${getPostUrl(post.id, insightId, spaceIdOrName)}?commentId=first`}
              label={t('insights.posts.comments.link')}
            >
              <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
                {t('insights.post.response', { count: post.numberOfComments })}
              </HoliUserAvatarPile>
            </HoliLink>
          </View>
        ) : (
          <View style={styles.noCommentsYetMessage}>
            <HoliLink
              href={commentUrl}
              label={t('insights.posts.comments.create_comment_button')}
              onPress={onPressCommentLink}
            >
              <HoliText size="small" style={{ color: colors.foreground20 }}>
                {t('insights.post.no-comment-yet')}
              </HoliText>
            </HoliLink>
          </View>
        )}

        <PostReactions post={post} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    border: `1px solid ${colors.background30}`,
    borderRadius: 12,
    backgroundColor: colors.background10,
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
  postTitleLink: {
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
  },
  linkPreview: {
    paddingTop: 16,
    maxWidth: 420,
    alignSelf: 'center',
  },
  reactionsBar: {
    paddingTop: 21,
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
