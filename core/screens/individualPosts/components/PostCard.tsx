import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, HoliLogoFilled, MoreFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type PostCardProps = {
  post: FeedPost
  showVisibilityBadge?: boolean
}

const PostCard = ({ post, showVisibilityBadge }: PostCardProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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
      <View style={styles.postDrawer}>
        <PostDrawer post={post}>
          <HoliIcon icon={MoreFilled} />
        </PostDrawer>
      </View>
      <View>
        <View style={[styles.pill, styles.categoryPill]}>
          <HoliText size="small" numberOfLines={1}>
            {post.category.title}
          </HoliText>
        </View>
      </View>
      <View style={styles.contenSection}>
        <HoliHeading level="2" size="s" numberOfLines={3}>
          {post.title}
        </HoliHeading>
        <HoliReadMore numberOfLines={3}>{post.description}</HoliReadMore>
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
      gap: Spacing.xs,
    },
    metadata: {
      alignContent: 'space-between',
    },
    contenSection: {
      gap: Spacing['4xs'],
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
    postDrawer: {
      position: 'absolute',
      top: Spacing.xs,
      right: Spacing.xs,
      zIndex: 1,
    },
  })

export default PostCard
