import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import HoliTranslate from '@holi/core/components/HoliTranslate'
import type { User } from '@holi/core/domain/shared/types'
import useDeletePost from '@holi/core/hooks/useDeletePost'
import i18n from '@holi/core/i18n'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { ContentType, ContentType3K } from '@holi/core/queries'
import PostImage from '@holi/core/screens/posts/components/PostImage'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { getPostUrl } from '@holi/core/screens/posts/components/helpers'
import type { Link, Post } from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2, Flag, GlobalFilled, LockFilled } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import type { ReadMoreNumberOfLines } from '@holi/ui/components/molecules/HoliReadMore/shared'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Stack } from 'holi-bricks/components/stack'

interface Props {
  post: Post
  insightId?: string
  spaceIdOrName?: string
  hasVisibilityIcon?: boolean
  numberOfLines?: ReadMoreNumberOfLines
  style?: StyleProp<ViewStyle>
}

const PostPreview = ({
  hasVisibilityIcon,
  insightId,
  post,
  spaceIdOrName,
  numberOfLines = 10,
  loading,
}: PropsWithSkeleton<Props>) => {
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { track } = useTracking()

  const commenters = post?.commenters.data
  const { isLoggedIn, user: loggedInUser } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { navigate } = useRouting()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { deletePost, isLoadingPostDeletion } = useDeletePost(post || ({} as Post), spaceIdOrName)

  const visibilityIcon = post?.isPublic ? GlobalFilled : LockFilled
  const visibilityIconText = post?.isPublic ? t('spaces.updates.filter.public') : t('spaces.updates.filter.members')

  const postUrl = getPostUrl(post?.id, insightId, spaceIdOrName)
  const commentUrl = postUrl + '/comment'

  const editAction = useCallback(() => {
    navigate(postUrl + '/edit')
  }, [navigate, postUrl])

  const isCurrentUserPostCreator = post?.creator.id === loggedInUser?.id

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const onPressCommentLink = () => {
    if (!isLoggedIn) {
      openSignupModal({
        description: t('comments.loginRedirect.text'),
        trackTrigger: 'COMMENT_ON_POST',
      })
      // return false prevents link execution
      return false
    }
  }
  const [text, setText] = useState(post?.text || '')
  const [title, setTitle] = useState(post?.title || '')

  const isTranslatable = post?.language && post.language && post.language !== i18n.language
  if (loading) {
    return (
      <View style={styles.container}>
        {/* Post Author */}
        <HoliMediaAuthorHeader loading role={post?.creator.role} />

        {/* Post Title */}
        <View style={styles.postTitleLink}>
          <HoliHeading level="3" size="s" loading>
            {post?.title}
          </HoliHeading>
        </View>

        {/* Post Text */}
        <HoliText loading skeletonOptions={{ numberOfLines: numberOfLines, borderRadius: 16 }} />

        {/* Reaction bar with comments and likes */}
        <View style={styles.reactionsBar}>
          <View style={styles.reactionsLink}>
            <HoliUserAvatarPile usersToShow={3} collapse loading>
              {t('comments.response', { count: post?.numberOfComments })}
            </HoliUserAvatarPile>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Visibility for space update posts */}
      {hasVisibilityIcon ? (
        <Stack alignItems="center" direction="row" padding={{ bottom: 'xs' }}>
          <HoliIcon icon={visibilityIcon} size={14} />
          <HoliBox padding={[0, 0, 0, 6]}>
            <HoliText size="extrasmall">{visibilityIconText}</HoliText>
          </HoliBox>
        </Stack>
      ) : null}

      {/* Author row with author, post date and three dot menu */}
      <Stack direction="row" justifyContent="space-between">
        {/* Author */}
        <HoliLink
          href={`/profile/${post?.creator.id}`}
          label={post?.creator.fullName || ''}
          testID="btn-to-post-creator-profile"
        >
          <HoliMediaAuthorHeader
            author={post?.creator || ({} as User)}
            authorBold
            date={post?.created}
            role={post?.creator.role}
          />
        </HoliLink>
        {/* Action drawer (three dot menu) */}
        <View>
          <HoliActionDrawer.Drawer label={t('insights.post.preview.more')} testID="post-three-dot-menu-button">
            {/* Report Action */}
            {/* reporting own content makes no sense, so we hide this option */}
            {!isCurrentUserPostCreator && (
              <HoliActionDrawer.Action
                icon={Flag}
                title={t('global.report')}
                testID="report-comment-button"
                handleAction={() => navigateWithAuth(`/report/${post?.id}/${ContentType.POST}/${ContentType3K.POST}`)}
              />
            )}
            {/* Edit Action */}
            {/* editing only allowed for own content */}
            {spaceIdOrName && isCurrentUserPostCreator && (
              <HoliActionDrawer.Action
                icon={Edit2}
                title={t('spaces.updates.edit')}
                testID="edit-update"
                handleAction={editAction}
              />
            )}
            {/* Delete Action */}
            {/* deleting only allowed for own content */}
            {isCurrentUserPostCreator && (
              <HoliActionDrawer.Action
                isLoading={isLoadingPostDeletion}
                icon={Delete}
                title={t('insights.post.delete.confirmation.title')}
                testID="delete-post-button"
                showConfirmation
                variant="danger"
              >
                <HoliActionDrawer.Confirmation
                  title={t('insights.post.delete.confirmation.title')}
                  description={t('insights.post.delete.confirmation.description')}
                  confirmText={t('confirmation.delete')}
                  dismissText={t('global.dismiss')}
                  handleConfirmation={deletePost}
                  buttonVariant="danger"
                  hasDismissBtn
                  requireLogin
                />
              </HoliActionDrawer.Action>
            )}
          </HoliActionDrawer.Drawer>
        </View>
      </Stack>

      <HoliLink href={getPostUrl(post?.id, insightId, spaceIdOrName)} label={post?.title || ''} testID="btn-to-post">
        {/* Post title */}
        {!!post?.title && (
          <View style={styles.postTitleLink}>
            <HoliHeading level="3" size="s" loading={loadingTranslation} skeletonOptions={{ numberOfLines: 1 }}>
              {title}
            </HoliHeading>
          </View>
        )}
        {/* Post content */}
        {hasMounted && (
          <HoliReadMore
            numberOfLines={numberOfLines}
            color="gray300"
            bold={false}
            style={styles.readMore}
            loading={loadingTranslation}
            skeletonOptions={{ numberOfLines: 3 }}
            onReadMoreSideEffect={() =>
              post.space && track(TrackingEvent.SpacePosts.read(post.id, post.title, post.space?.id))
            }
          >
            <HoliRichTextOutput
              text={text || ''}
              users={post?.mentions || []}
              links={post?.links || []}
              allowAllLinks
              color="default"
            />
          </HoliReadMore>
        )}
      </HoliLink>

      {/* Post image */}
      {post?.image && (
        <PostImage
          uri={post?.image.url || ''}
          height={post?.image.height}
          width={post?.image.width}
          postTitle={post?.title}
        />
      )}

      {/* Post link previews */}
      {!!post?.links?.length &&
        post.links.map((link, index) => {
          return (
            <HoliBox padding={[0, 24]} key={index}>
              <HoliLinkPreview style={styles.linkPreview} previewData={link || ({} as Link)} label={link.title || ''} />
            </HoliBox>
          )
        })}
      {isTranslatable && (
        <HoliTranslate
          primaryText={{ text, setText }}
          secondaryText={{ text: title, setText: setTitle }}
          loading={loadingTranslation}
          setLoading={setLoadingTranslation}
          trackingEvent={TrackingEvent.ContentTranslated('feed_post', post.id)}
        />
      )}
      {/* Reaction bar with comments and likes */}
      <View style={styles.reactionsBar}>
        {/* Comments */}
        {post?.numberOfComments > 0 ? (
          <View style={styles.reactionsLink}>
            <HoliLink
              href={`${getPostUrl(post?.id, insightId, spaceIdOrName)}?commentId=first`}
              label={t('comments.link')}
            >
              <HoliUserAvatarPile users={commenters?.length ? [...commenters] : []} usersToShow={3} collapse>
                {t('comments.response', { count: post?.numberOfComments })}
              </HoliUserAvatarPile>
            </HoliLink>
          </View>
        ) : (
          <View style={styles.noCommentsYetMessage}>
            <HoliLink href={commentUrl} label={t('comments.create_comment_button')} onPress={onPressCommentLink}>
              <HoliText size="small" style={{ color: colors.foreground20 }}>
                {t('insights.post.no-comment-yet')}
              </HoliText>
            </HoliLink>
          </View>
        )}

        {/* Reactions */}
        <PostReactions post={post || ({} as Post)} />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.foreground10,
      borderRadius: 12,
      backgroundColor: theme.colors.background10,
    },
    postTitleLink: {
      marginVertical: 4,
    },
    readMore: {
      width: '100%',
    },
    imageContainer: {
      width: '100%',
    },
    linkPreview: {
      paddingTop: 16,
      maxWidth: 420,
      width: '100%',
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
