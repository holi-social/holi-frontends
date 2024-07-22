import { withProfiler } from '@sentry/react'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoginState } from '@holi/core/auth/loginState'
import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import HoliMediaSpaceAuthorHeader from '@holi/core/components/HoliMediaSpaceAuthorHeader'
import HoliTranslate from '@holi/core/components/HoliTranslate'
import useDeletePost from '@holi/core/hooks/useDeletePost'
import useReportContent from '@holi/core/hooks/useReportContent'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType } from '@holi/core/queries'
import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import { Post } from '@holi/core/screens/posts/types'
import type { Term, User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2, Flag, GlobalFilled, HoliLogoFilled, MoreFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type GenericPostCardProps = {
  post: FeedPost | Post
  showVisibilityBadge?: boolean
  allTopics?: Term[]
}

const NUMBER_OF_LINES = 3

const GenericPostCard = ({ post, showVisibilityBadge, allTopics }: GenericPostCardProps) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()
  const { track } = useTracking()
  const { isLoggedIn } = useLoginState()
  const { user } = useLoggedInUser()
  const [description, setDescription] = useState<string>((post as Post).text ?? (post as FeedPost).description)
  const [title, setTitle] = useState<string>(post.title)

  const [isLoadingSpacePostReport, reportSpacePostContent] = useReportContent({
    id: post?.id || '',
    contentType: ContentType.POST,
    successMsg: t('global.report.successMessage'),
  })

  const { deletePost: deleteSpacePost, isLoadingPostDeletion: isLoadingSpacePostDeletion } = useDeletePost(
    post as Post,
    (post as Post).space?.id
  )

  const isTranslatable = post.language && post.language !== i18n.language

  const editSpacePost = useCallback(() => {
    navigate(`/spaces/${(post as Post).space?.id}/updates/${post.id}/edit`)
  }, [navigate, post])

  if (post.__typename === 'FeedPost') {
    const feedPost = post as FeedPost
    const aggregatedTopics = allTopics?.filter((topic) =>
      feedPost.topics?.some((selectedTopic) => selectedTopic.id === topic.id)
    )
    const goToDetailView = () => navigate(`/feed-posts/${feedPost.slug}`)
    return (
      <View style={styles.container}>
        {showVisibilityBadge && (
          <View style={styles.badgeContainer}>
            <HoliIcon
              icon={feedPost.visibility === VisibilityLevel.PUBLIC ? GlobalFilled : HoliLogoFilled}
              color={colors.foreground30}
              size={14}
            />
            <HoliText>
              {feedPost.visibility === VisibilityLevel.PUBLIC
                ? t('individuals.post.card.badge.public')
                : t('individuals.post.card.badge.registered_users_only')}
            </HoliText>
          </View>
        )}
        <HoliMediaAuthorHeader author={feedPost.author} authorBold date={feedPost.createdAt} />
        {isLoggedIn && (
          <View style={styles.postDrawer}>
            <PostDrawer post={feedPost}>
              <HoliIcon icon={MoreFilled} />
            </PostDrawer>
          </View>
        )}
        <HoliButton
          transparent
          label={title}
          onPress={goToDetailView}
          style={styles.clickOverlay}
          testID="post-card-detail-view-btn"
        >
          <View style={styles.clickableArea}>
            <View style={styles.pillContainer}>
              <View style={[styles.pill, styles.categoryPill]}>
                <HoliText size="small" numberOfLines={1}>
                  {feedPost.category.label}
                </HoliText>
              </View>
              {aggregatedTopics && aggregatedTopics?.length > 0 && (
                <View style={[styles.pill, styles.topicPill]}>
                  <HoliText size="small" numberOfLines={1}>
                    {`${aggregatedTopics[0]?.title} ${
                      aggregatedTopics.length > 1 ? `+${aggregatedTopics.length - 1}` : ''
                    }`}
                  </HoliText>
                </View>
              )}
            </View>
            <View style={styles.contentSection}>
              <HoliHeading level="2" size="s" numberOfLines={3}>
                {title}
              </HoliHeading>
            </View>
          </View>
        </HoliButton>

        <View style={styles.description}>
          <HoliReadMore
            numberOfLines={NUMBER_OF_LINES}
            color="gray300"
            bold={false}
            onReadMoreSideEffect={() => track(TrackingEvent.FeedPosts.read(feedPost.id))}
          >
            <HoliRichTextOutput
              text={description}
              allowAllLinks
              onPressText={() => {
                goToDetailView()
              }}
              color="gray300"
              users={feedPost.mentionedUsers}
            />
          </HoliReadMore>
          {isTranslatable && (
            <HoliTranslate
              primaryText={{ text: description, setText: setDescription }}
              secondaryText={{ text: title, setText: setTitle }}
            />
          )}
        </View>

        {!!feedPost.imageUrl && (
          <HoliButton transparent label={title} onPress={goToDetailView} style={styles.clickOverlay}>
            <View style={styles.imageContainer}>
              <HoliImage
                label={title}
                source={{
                  uri: feedPost.imageUrl,
                }}
                blurhash={feedPost.imageBlurhash}
                resizeMode="cover"
                style={styles.image}
              />
            </View>
          </HoliButton>
        )}
        {!feedPost.imageUrl && !!feedPost.linkPreview && (
          <HoliLinkPreview
            previewData={feedPost.linkPreview}
            onPress={() => track(TrackingEvent.FeedPosts.read(feedPost.id))}
          />
        )}

        <View style={styles.reactionsBar}>
          <HoliButton transparent inline onPress={goToDetailView} label="btn-comment-to-feed-post">
            {feedPost.totalComments > 0 ? (
              <HoliUserAvatarPile users={feedPost.commenters.data as User[]} usersToShow={5} collapse>
                {t('comments.response', { count: feedPost.totalComments })}
              </HoliUserAvatarPile>
            ) : (
              <HoliText color="gray300">{t('individuals.post.card.firstComment')}</HoliText>
            )}
          </HoliButton>
          <FeedPostReactions post={feedPost} />
        </View>
      </View>
    )
  } else {
    const spacePost = post as Post
    const isCurrentUserPostCreator = spacePost.creator.id === user?.id
    const goToDetailView = () => navigate(`/posts/${spacePost.id}`)
    return (
      <View style={styles.container}>
        {showVisibilityBadge && (
          <View style={styles.badgeContainer}>
            <HoliIcon icon={spacePost.isPublic ? GlobalFilled : HoliLogoFilled} color={colors.foreground30} size={14} />
            <HoliText>
              {spacePost.isPublic
                ? t('individuals.post.card.badge.public')
                : t('individuals.post.card.badge.registered_users_only')}
            </HoliText>
          </View>
        )}
        {spacePost.space && (
          <HoliMediaSpaceAuthorHeader author={spacePost.creator} space={spacePost.space} date={spacePost.created} />
        )}
        {isLoggedIn && (
          <View style={styles.postDrawer}>
            <HoliActionDrawer.Drawer
              label={t('global.moreOptions')}
              testID="post-three-dot-menu-button"
              buttonElement={<HoliIcon icon={MoreFilled} />}
            >
              {!isCurrentUserPostCreator && (
                <HoliActionDrawer.Action
                  isLoading={isLoadingSpacePostReport}
                  icon={Flag}
                  title={t('global.report')}
                  testID="report-comment-button"
                  showConfirmation
                >
                  <HoliActionDrawer.Confirmation
                    title={t('insights.post.report.confirmation.title')}
                    description={t('insights.post.report.confirmation.description')}
                    handleConfirmation={reportSpacePostContent}
                    hasDismissBtn
                    requireLogin
                  />
                </HoliActionDrawer.Action>
              )}
              {spacePost.space?.id && isCurrentUserPostCreator && (
                <HoliActionDrawer.Action
                  icon={Edit2}
                  title={t('spaces.updates.edit')}
                  testID="edit-update"
                  handleAction={editSpacePost}
                />
              )}
              {isCurrentUserPostCreator && (
                <HoliActionDrawer.Action
                  isLoading={isLoadingSpacePostDeletion}
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
                    handleConfirmation={deleteSpacePost}
                    buttonType="warning"
                    hasDismissBtn
                    requireLogin
                  />
                </HoliActionDrawer.Action>
              )}
            </HoliActionDrawer.Drawer>
          </View>
        )}
        <HoliButton
          transparent
          label={title}
          onPress={goToDetailView}
          style={styles.clickOverlay}
          testID="post-card-detail-view-btn"
        >
          <View style={styles.clickableArea}>
            <View style={styles.contentSection}>
              <HoliHeading level="2" size="s" numberOfLines={3}>
                {title}
              </HoliHeading>
            </View>
          </View>
        </HoliButton>

        <View style={styles.description}>
          <HoliReadMore
            numberOfLines={NUMBER_OF_LINES}
            color="gray300"
            bold={false}
            onReadMoreSideEffect={() => track(TrackingEvent.Posts.read(spacePost.id, spacePost.space?.id))}
          >
            <HoliRichTextOutput
              text={description}
              allowAllLinks
              onPressText={() => {
                goToDetailView()
              }}
              color="gray300"
              users={spacePost.mentions}
            />
          </HoliReadMore>
          {isTranslatable && (
            <HoliTranslate
              primaryText={{ text: description, setText: setDescription }}
              secondaryText={{ text: title, setText: setTitle }}
            />
          )}
        </View>

        {!!spacePost.image && (
          <HoliButton transparent label={title} onPress={goToDetailView} style={styles.clickOverlay}>
            <View style={styles.imageContainer}>
              <HoliImage
                label={title}
                source={{
                  uri: spacePost.image.url,
                }}
                blurhash={spacePost.image.imageBlurhash}
                resizeMode="cover"
                style={styles.image}
              />
            </View>
          </HoliButton>
        )}
        {!spacePost.image && !!spacePost.links?.[0] && (
          <HoliLinkPreview
            style={styles.linkPreview}
            previewData={spacePost.links?.[0]}
            onPress={() => track(TrackingEvent.Posts.read(spacePost.id, spacePost.space?.id))}
          />
        )}

        <View style={styles.reactionsBar}>
          <HoliButton transparent inline onPress={goToDetailView} label="btn-comment-to-feed-post">
            {spacePost.numberOfComments > 0 ? (
              <HoliUserAvatarPile users={spacePost.commenters.data as User[]} usersToShow={5} collapse>
                {t('comments.response', { count: spacePost.numberOfComments })}
              </HoliUserAvatarPile>
            ) : (
              <HoliText color="gray300">{t('individuals.post.card.firstComment')}</HoliText>
            )}
          </HoliButton>
          <PostReactions post={spacePost} />
        </View>
      </View>
    )
  }
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      padding: Spacing.xs,
      borderColor: theme.colors.gray200,
      borderWidth: 1,
    },
    metadata: {
      alignContent: 'space-between',
    },
    contentSection: {
      gap: Spacing['4xs'],
    },
    pillContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing['3xs'],
    },
    pill: {
      borderRadius: Spacing.xxl,
      paddingVertical: Spacing['4xs'],
      paddingHorizontal: Spacing['3xs'],
      alignSelf: 'flex-start',
    },
    categoryPill: {
      backgroundColor: theme.dark ? theme.colors.brandA300 : theme.colors.brandA100,
    },
    topicPill: {
      backgroundColor: theme.dark ? theme.colors.brandC300 : theme.colors.brandC100,
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
      paddingBottom: Spacing.xs,
    },
    imageContainer: {
      borderRadius: Spacing.xxs,
      width: '100%',
      aspectRatio: 16 / 9,
      overflow: 'hidden',
      marginTop: Spacing.xs,
    },
    image: {
      height: '100%',
    },
    postDrawer: {
      position: 'absolute',
      top: Spacing.xs,
      right: Spacing.xs,
      zIndex: 1,
    },
    reactionsBar: {
      marginTop: Spacing.xxs,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    clickableArea: {
      gap: Spacing.xs,
      marginTop: Spacing.xs,
    },
    clickOverlay: {
      position: 'relative',
      pointerEvents: 'auto',
      gap: Spacing.xs,
    },
    description: {
      marginTop: Spacing.xxs,
    },
    linkPreview: {
      marginTop: Spacing.xs,
    },
  })

export default withProfiler(GenericPostCard, { name: 'PostCard' })
