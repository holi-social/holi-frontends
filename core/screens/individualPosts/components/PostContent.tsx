import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, HoliLogoFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type PostContentProps = {
  post: FeedPost
  showVisibilityBadge?: boolean
}

const PostContent = ({ post, showVisibilityBadge }: PostContentProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  //TODO: replace with real data
  const comments: readonly Comment[] = []
  const commenters: User[] = []

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
      <HoliMediaHeader
        title={post.creator.fullName || t('user.profileView.anonymous')}
        author={post.creator}
        date={post.createdAt}
        boldTitle
      />
      <View>
        <View style={[styles.pill, styles.categoryPill]}>
          <HoliText size="small" numberOfLines={1}>
            {post.category.title}
          </HoliText>
        </View>
      </View>
      <View style={styles.contenSection}>
        <HoliHeading level="1" size="m" numberOfLines={3}>
          {post.title}
        </HoliHeading>
        <HoliRichTextOutput text={post.description} />
      </View>
      {!!post.image && (
        <View style={styles.imageContainer}>
          <HoliImage
            label={post.title}
            source={{
              uri: post.image,
            }}
            blurhash={post.imageBlurhash}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      )}
      {!!post.linkPreview && <HoliLinkPreview previewData={post.linkPreview} />}
      <View style={styles.reactionsBar}>
        {comments.length > 0 && (
          <HoliUserAvatarPile users={commenters} usersToShow={3} collapse>
            {t('individuals.post.comments.response', { count: comments.length })}
          </HoliUserAvatarPile>
        )}
        <FeedPostReactions post={post} />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: Spacing.xs,
      gap: Spacing.xs,
    },
    metadata: {
      alignContent: 'space-between',
    },
    contenSection: {
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    pill: {
      borderRadius: Spacing.xxl,
      paddingVertical: Spacing['4xs'],
      paddingHorizontal: Spacing['3xs'],
      alignSelf: 'flex-start',
    },
    categoryPill: {
      backgroundColor: theme.colors.brandA100,
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['3xs'],
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
    reactionsBar: {
      marginTop: Spacing.xxs,
      marginLeft: Spacing.xs,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  })

export default PostContent
