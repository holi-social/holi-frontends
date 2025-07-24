import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import type { Post } from '@holi/core/screens/posts/types'
import UserAvatarPile from '@holi/core/screens/individualPosts/components/PostResponseBar/UserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { Comment, Share } from '@holi/icons/src/generated'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Text } from 'holi-bricks/components/text'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import PostReactButton from '@holi/core/screens/individualPosts/components/PostReactButton'
import { ButtonIcon } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import ReactionCount from '@holi/core/components/reactions/ReactionCount'

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
      <Stack direction="row" justifyContent="space-between" alignItems="center" margin={{ top: '4xs', bottom: '4xs' }}>
        <Pressable onPress={onCommentPress}>
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
        </Pressable>
        <ReactionCount count={post.reactions.HEART} />
      </Stack>
      <HoliDivider />
      <Stack margin={{ top: '4xs' }} direction="row" justifyContent="space-between">
        <Stack direction="row" gap="sm">
          <ButtonIcon
            onPress={onCommentPress}
            icon={Comment}
            size="lg"
            color="default"
            transparent
            label={t('comments.link')}
          />
          <ButtonIcon onPress={onShare} icon={Share} size="lg" color="default" transparent label={t('global.share')} />
        </Stack>
        <PostReactButton post={post} />
      </Stack>
    </View>
  )
}

const styles = StyleSheet.create({
  reactionsBar: {
    marginTop: Spacing.xxs,
  },
  commentTextContainer: {
    justifyContent: 'center',
    height: 24,
    paddingVertical: 2,
  },
})

export default PostResponseBar
