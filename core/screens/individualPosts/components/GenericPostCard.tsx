import { withProfiler } from '@sentry/react'
import { ChipLabel } from 'holi-bricks/components/chips'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import HoliMediaSpaceAuthorHeader from '@holi/core/components/HoliMediaSpaceAuthorHeader'
import type { Term, User } from '@holi/core/domain/shared/types'
import useDeletePost from '@holi/core/hooks/useDeletePost'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'
import ImageCarousel from '@holi/core/screens/individualPosts/components/ImageCarousel'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import PostLocationCard from '@holi/core/screens/individualPosts/components/PostLocationCard'
import { type FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import PostReactions from '@holi/core/screens/posts/components/PostReactions'
import type { Post } from '@holi/core/screens/posts/types'
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
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import SpaceFeedFollow from '@holi/core/screens/spaces/details/components/SpaceFeedFollow'
import HoliTranslate from '@holi/core/components/HoliTranslate'

type GenericPostCardProps = {
  post: FeedPost | Post
  showVisibilityBadge?: boolean
  allTopics?: readonly Term[]
}

const NUMBER_OF_LINES = 3

const GenericPostCard = ({ post, showVisibilityBadge, allTopics }: GenericPostCardProps) => {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()
  const { track } = useTracking()
  const { isLoggedIn, user } = useLoggedInUser()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const [description, setDescription] = useState<string>((post as Post).text ?? (post as FeedPost).description)
  const [title, setTitle] = useState<string>(post.title)
  const [loadingTranslation, setLoadingTranslation] = useState(false)

  const { deletePost: deleteSpacePost, isLoadingPostDeletion: isLoadingSpacePostDeletion } = useDeletePost(
    post as Post,
    (post as Post).space?.id
  )
  const isTranslatable = post.language && post.language !== i18n.language
  const showTranslation = useFeatureFlagToggle(FeatureFlagKey.POST_TRANSLATION) && isTranslatable

  const editSpacePost = useCallback(() => {
    navigate(`/spaces/${(post as Post).space?.id}/updates/${post.id}/edit`)
  }, [navigate, post])

  useEffect(() => {
    setTitle(post.title)
    setDescription((post as Post).text ?? (post as FeedPost).description)
  }, [post])

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

        <HoliMediaAuthorHeader
          author={feedPost.author}
          authorBold
          date={feedPost.createdAt}
          role={feedPost.author.role}
          style={styles.authorHeader}
        />
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
              <ChipLabel size="sm" color="yellow">
                {feedPost.category.label}
              </ChipLabel>
              {aggregatedTopics && aggregatedTopics?.length > 0 && (
                <ChipLabel size="sm" color="green">{`${aggregatedTopics[0]?.title} ${
                  aggregatedTopics.length > 1 ? `+${aggregatedTopics.length - 1}` : ''
                }`}</ChipLabel>
              )}
            </View>
            <View style={styles.contentSection}>
              <HoliHeading
                level="2"
                size="s"
                numberOfLines={3}
                skeletonOptions={{ numberOfLines: 1 }}
                loading={loadingTranslation}
              >
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
            loading={loadingTranslation}
            skeletonOptions={{ numberOfLines: NUMBER_OF_LINES }}
            style={styles.readMore}
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
          {showTranslation && (
            <HoliTranslate
              primaryText={{ text: description, setText: setDescription }}
              secondaryText={{ text: title, setText: setTitle }}
              loading={loadingTranslation}
              setLoading={setLoadingTranslation}
              trackingEvent={TrackingEvent.ContentTranslated('feed_post', feedPost.id)}
            />
          )}
        </View>

        {!!feedPost.images && !!feedPost.images.length && (
          <ImageCarousel images={feedPost.images} style={styles.imageCarousel} onPressItem={goToDetailView} />
        )}

        {!feedPost.imageUrl && !!feedPost.linkPreview && (
          <HoliLinkPreview
            style={styles.linkPreview}
            previewData={feedPost.linkPreview}
            onPress={() => track(TrackingEvent.FeedPosts.read(feedPost.id))}
          />
        )}
        {!!feedPost.location && (
          <View style={styles.locationCard}>
            <PostLocationCard location={feedPost.location} geolocation={feedPost.geolocation} />
          </View>
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
          <HoliMediaSpaceAuthorHeader
            author={spacePost.creator}
            space={spacePost.space}
            date={spacePost.created}
            role={spacePost.creator.role}
          />
        )}
        {isLoggedIn && (
          <View style={styles.postDrawer}>
            <HoliActionDrawer.Drawer
              label={t('global.moreOptions')}
              testID="post-three-dot-menu-button"
              buttonElement={<HoliIcon icon={MoreFilled} />}
            >
              {spacePost.space && !isCurrentUserPostCreator && <SpaceFeedFollow space={spacePost.space} />}
              {!isCurrentUserPostCreator && (
                <HoliActionDrawer.Action
                  icon={Flag}
                  title={t('global.report')}
                  testID="report-comment-button"
                  handleAction={() => navigateWithAuth(`/report/${post?.id}/${ContentType.POST}/${ContentType3K.POST}`)}
                />
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
              <HoliHeading
                level="2"
                size="s"
                numberOfLines={3}
                loading={loadingTranslation}
                skeletonOptions={{ numberOfLines: 1 }}
              >
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
            onReadMoreSideEffect={() => track(TrackingEvent.SpacePosts.read(spacePost.id, spacePost.space?.id))}
            loading={loadingTranslation}
            skeletonOptions={{ numberOfLines: NUMBER_OF_LINES }}
            style={styles.readMore}
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
          {showTranslation && (
            <HoliTranslate
              primaryText={{ text: description, setText: setDescription }}
              secondaryText={{ text: title, setText: setTitle }}
              loading={loadingTranslation}
              setLoading={setLoadingTranslation}
              trackingEvent={TrackingEvent.ContentTranslated('space_post', spacePost.id)}
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
            onPress={() => track(TrackingEvent.SpacePosts.read(spacePost.id, spacePost.space?.id))}
          />
        )}
        {spacePost.location && (
          <View style={styles.locationCard}>
            <PostLocationCard location={spacePost.location} geolocation={spacePost.geolocation} />
          </View>
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
    readMore: {
      width: '100%',
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
    imageCarousel: {
      marginTop: Spacing.xs,
    },
    description: {
      marginTop: Spacing.xxs,
    },
    linkPreview: {
      marginTop: Spacing.xs,
    },
    locationCard: {
      paddingTop: Spacing['3xs'],
    },
    authorHeader: {
      paddingRight: Spacing.lg,
    },
  })

export default withProfiler(GenericPostCard, { name: 'PostCard' })
