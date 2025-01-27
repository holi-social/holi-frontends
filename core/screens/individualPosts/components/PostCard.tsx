import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import { Term, User } from '@holi/core/domain/shared/types'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, HoliLogoFilled, MoreFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type PostCardProps = {
  post: FeedPost
  showVisibilityBadge?: boolean
  allTopics?: Term[]
}

const NUMBER_OF_LINES = 3

const PostCard = ({ post, showVisibilityBadge, allTopics }: PostCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()
  const { track } = useTracking()
  const { isLoggedIn } = useLoggedInUser()

  const aggregatedTopics = allTopics?.filter((topic) =>
    post.topics?.some((selectedTopic) => selectedTopic.id === topic.id)
  )

  const goToDetailView = () => navigate(`/feed-posts/${post.slug}`)
  return (
    <View style={styles.container}>
      {showVisibilityBadge && (
        <View style={styles.badgeContainer}>
          <HoliIcon
            icon={post.visibility === VisibilityLevel.PUBLIC ? GlobalFilled : HoliLogoFilled}
            color={colors.foreground30}
            size={14}
          />
          <HoliText>
            {post.visibility === VisibilityLevel.PUBLIC
              ? t('individuals.post.card.badge.public')
              : t('individuals.post.card.badge.registered_users_only')}
          </HoliText>
        </View>
      )}
      <HoliMediaAuthorHeader author={post.author} authorBold date={post.createdAt} />
      {isLoggedIn && (
        <View style={styles.postDrawer}>
          <PostDrawer post={post}>
            <HoliIcon icon={MoreFilled} />
          </PostDrawer>
        </View>
      )}
      <HoliButton
        transparent
        label={post.title}
        onPress={goToDetailView}
        style={styles.clickOverlay}
        testID="post-card-detail-view-btn"
      >
        <View style={styles.clickableArea}>
          <View style={styles.pillContainer}>
            {post.category && (
              <View style={[styles.pill, styles.categoryPill]}>
                <HoliText size="small" numberOfLines={1}>
                  {post.category.label}
                </HoliText>
              </View>
            )}
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
              {post.title}
            </HoliHeading>
          </View>
        </View>
      </HoliButton>

      <View style={styles.description}>
        <HoliReadMore
          numberOfLines={NUMBER_OF_LINES}
          color="gray300"
          bold={false}
          onReadMoreSideEffect={() => track(TrackingEvent.FeedPosts.read(post.id))}
        >
          <HoliRichTextOutput
            text={post.description}
            allowAllLinks
            onPressText={() => {
              goToDetailView()
            }}
            color="gray300"
            users={post.mentionedUsers}
          />
        </HoliReadMore>
      </View>

      {!!post.imageUrl && (
        <HoliButton transparent label={post.title} onPress={goToDetailView} style={styles.clickOverlay}>
          <View style={styles.imageContainer}>
            <HoliImage
              label={post.title}
              source={{
                uri: post.imageUrl,
              }}
              blurhash={post.imageBlurhash}
              resizeMode="cover"
              style={styles.image}
            />
          </View>
        </HoliButton>
      )}
      {!post.imageUrl && !!post.linkPreview && (
        <HoliLinkPreview previewData={post.linkPreview} onPress={() => track(TrackingEvent.FeedPosts.read(post.id))} />
      )}

      <View style={styles.reactionsBar}>
        <HoliButton transparent inline onPress={goToDetailView} label="btn-comment-to-feed-post">
          {post.totalComments > 0 ? (
            <HoliUserAvatarPile users={post.commenters.data as User[]} usersToShow={5} collapse>
              {t('comments.response', { count: post.totalComments })}
            </HoliUserAvatarPile>
          ) : (
            <HoliText color="gray300">{t('individuals.post.card.firstComment')}</HoliText>
          )}
        </HoliButton>
        <FeedPostReactions post={post} />
      </View>
    </View>
  )
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
      marginBottom: Spacing.xs,
    },
  })

export default withProfiler(PostCard, { name: 'PostCard' })
