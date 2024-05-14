import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import FeedPostReactions from '@holi/core/screens/individualPosts/components/FeedPostReactions'
import PostDrawer from '@holi/core/screens/individualPosts/components/PostDrawer'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, HoliLogoFilled, MoreFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import Spacing from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type PostCardProps = {
  post: FeedPost
  showVisibilityBadge?: boolean
}

// temporarily solution to use HoliRichTextOutput within a read more type component.
// with 3 max lines, react-native returns a 67 height with our current font and line-height.
// if the text's height is greater than 67, it is assumed to have a Read More button.
const LINE_HEIGHT = 23
const NUMBER_OF_LINES = 3

const PostCard = ({ post, showVisibilityBadge }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>() // undefined is used when no Read More button is needed, false is Read More and true is Read Less
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()

  const goToDetailView = () => navigate(`/feed-posts/${post.slug}`)

  // calculation of text height to check wether Read More button should be displayed
  const handleTextLayoutEvent = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.height > LINE_HEIGHT * NUMBER_OF_LINES && isExpanded === undefined) {
      setIsExpanded(false)
    }
  }

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
      <HoliButton transparent label={post.title} onPress={goToDetailView} style={styles.clickOverlay}>
        <View style={styles.clickableArea}>
          <View style={[styles.pill, styles.categoryPill]}>
            <HoliText size="small" numberOfLines={1}>
              {post.category.title}
            </HoliText>
          </View>
          <View style={styles.contentSection}>
            <HoliHeading level="2" size="s" numberOfLines={3}>
              {post.title}
            </HoliHeading>
          </View>
        </View>
      </HoliButton>

      {/* not clickable */}
      <View>
        <HoliRichTextOutput
          text={post.description}
          allowAllLinks
          ellipsizeMode="tail"
          onLayout={handleTextLayoutEvent}
          style={{ maxHeight: typeof isExpanded === 'undefined' ? LINE_HEIGHT * (NUMBER_OF_LINES + 1) : undefined }}
          {...(typeof isExpanded === 'boolean' ? { numberOfLines: isExpanded ? undefined : 3 } : {})}
        />
        {typeof isExpanded === 'boolean' && (
          <HoliButton
            label={isExpanded ? t('component.readMore.readLess') : t('component.readMore.readMore')}
            transparent
            inline
            style={styles.readMoreButton}
            onPress={() => setIsExpanded((value) => !value)}
          >
            {isExpanded ? t('component.readMore.readLess') : t('component.readMore.readMore')}
          </HoliButton>
        )}
      </View>

      {!!post.image && (
        <HoliButton transparent label={post.title} onPress={goToDetailView} style={styles.clickOverlay}>
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
        </HoliButton>
      )}
      {!!post.linkPreview && <HoliLinkPreview previewData={post.linkPreview} />}

      <View style={styles.reactionsBar}>
        <HoliButton transparent inline onPress={goToDetailView} label="btn-comment-to-feed-post">
          <HoliText color="gray300">{t('individuals.post.card.firstComment')}</HoliText>
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
      gap: Spacing.xs,
    },
    metadata: {
      alignContent: 'space-between',
    },
    contentSection: {
      gap: Spacing['4xs'],
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
    reactionsBar: {
      marginTop: Spacing.xxs,
      marginLeft: Spacing.xs,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    clickableArea: {
      gap: Spacing.xs,
    },
    readMoreButton: {
      alignItems: 'flex-end',
    },
    clickOverlay: {
      position: 'relative',
      pointerEvents: 'auto',
      gap: Spacing.xs,
    },
  })

export default PostCard
