import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import type { Post } from '@holi/core/screens/posts/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import UserAvatarPile from '@holi/core/screens/individualPosts/components/PostResponseBar/UserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { Comment, Share } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Text } from 'holi-bricks/components/text'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'

interface PostResponseBarProps {
  post: FeedPost | Post
  onCommentPress: () => void
  style?: React.ComponentProps<typeof View>['style']
}

const PostResponseBar = ({ post, onCommentPress, style }: PostResponseBarProps) => {
  const { t } = useTranslation()

  const isFeedPost = post.__typename === 'FeedPost'
  const commentCount = isFeedPost ? (post as FeedPost).totalComments : (post as Post).numberOfComments
  const commenters = isFeedPost ? (post as FeedPost).commenters.data : (post as Post).commenters.data
  const { track } = useTracking()

  const [, shareLink] = useShareLink({
    link: `/feed-posts/${(post as FeedPost).slug}`,
    linkType: LinkType.UNIVERSAL,
    message: post.title,
  })

  const onShare = async () => {
    if ((await shareLink()) === 'shared') {
      track(
        TrackingEvent.FeedPosts.shared(post.id, post.title, {
          id: (post as FeedPost).author.id,
          name: (post as FeedPost).author.fullName,
          role: (post as FeedPost).author.role,
        })
      )
    }
  }

  return (
    <View style={[styles.reactionsBar, style]}>
      <View style={styles.topItems}>
        <HoliButton
          transparent
          inline
          onPress={onCommentPress}
          label="btn-comment-to-feed-post"
          style={styles.commentButton}
        >
          {commentCount > 0 ? (
            <UserAvatarPile users={commenters as User[]} usersToShow={5} collapse>
              {t('comments.response', { count: commentCount })}
            </UserAvatarPile>
          ) : (
            <View style={styles.commentTextContainer}>
              <Text size="xs" colorOverride={lightTheme.colors.fill.default} bold>
                {t('individuals.post.card.comment')}
              </Text>
            </View>
          )}
        </HoliButton>
        <View style={styles.rightItems}>
          <FeedPostReactions post={post} />
        </View>
      </View>
      <HoliDivider />
      <View style={styles.bottomItems}>
        <View style={styles.leftItems}>
          <Pressable onPress={onCommentPress}>
            <HoliIcon icon={Comment} size={24} />
          </Pressable>
          <Pressable onPress={onShare}>
            <HoliIcon icon={Share} size={24} colorOverride={lightTheme.colors.fill.default} />
          </Pressable>
        </View>
        <View style={styles.rightItems}>
          <FeedPostReactions post={post} showCount={false} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topItems: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  reactionsBar: {
    marginTop: Spacing.xxs,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  commentButton: {
    alignSelf: 'flex-start',
  },
  commentTextContainer: {
    justifyContent: 'center',
    height: 24,
    paddingVertical: 2,
  },
  bottomItems: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  centerItem: {
    flex: 1,
    alignItems: 'center',
  },
  rightItems: {
    alignItems: 'flex-end',
  },
  leftItems: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
})

export default PostResponseBar
