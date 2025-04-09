import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import HoliTranslate from '@holi/core/components/HoliTranslate'
import { useBreakpointMatcher } from '@holi/core/helpers'
import ImageCarousel from '@holi/core/screens/individualPosts/components/ImageCarousel'
import { type FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, HoliLogoFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

type PostContentProps = {
  post: FeedPost
  showVisibilityBadge?: boolean
}

const PostContent = ({ post, showVisibilityBadge }: PostContentProps) => {
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const contentSpacing = screenWidth < dimensions.breakpointS ? Spacing.xs : Spacing.md
  const smStyle = useBreakpointMatcher([[dimensions.breakpointS, true]])
  const styles = useMemo(() => getStyles(theme, !!smStyle, contentSpacing), [theme, smStyle, contentSpacing])

  const [description, setDescription] = useState(post.description)
  const [title, setTitle] = useState(post.title)

  const isTranslatable = post.language && post.language !== i18n.language

  return (
    <>
      <View style={styles.container} testID="post-content-container">
        {showVisibilityBadge && (
          <View style={styles.badgeContainer}>
            <HoliIcon
              icon={post.visibility === VisibilityLevel.PUBLIC ? GlobalFilled : HoliLogoFilled}
              colorOverride={theme.colors.foreground30}
              size={14}
            />
            <HoliText>
              {post.visibility === VisibilityLevel.PUBLIC
                ? t('individuals.post.card.badge.public')
                : t('individuals.post.card.badge.registered_users_only')}
            </HoliText>
          </View>
        )}
        <HoliMediaAuthorHeader author={post.author} authorBold date={post.createdAt} role={post.author.role} />
        <View style={styles.pillContainer}>
          {post.category && (
            <View style={[styles.pill, styles.categoryPill]}>
              <HoliText size="small" numberOfLines={1}>
                {post.category.label}
              </HoliText>
            </View>
          )}
          {post.topicsV2?.map((topic) => (
            <View style={[styles.pill, styles.topicPill]} key={topic}>
              <HoliText size="small" numberOfLines={1}>
                {t(`topic.${topic}`)}
              </HoliText>
            </View>
          ))}
        </View>
        <View style={styles.contentSection}>
          <HoliHeading
            level="1"
            size="m"
            numberOfLines={3}
            loading={loadingTranslation}
            skeletonOptions={{ numberOfLines: 1 }}
          >
            {title}
          </HoliHeading>
          <HoliRichTextOutput
            text={description}
            allowAllLinks
            users={post.mentionedUsers || []}
            loading={loadingTranslation}
            skeletonOptions={{ numberOfLines: 3 }}
            style={styles.description}
          />
        </View>
        {isTranslatable && (
          <HoliTranslate
            primaryText={{ text: description, setText: setDescription }}
            secondaryText={{ text: title, setText: setTitle }}
            loading={loadingTranslation}
            setLoading={setLoadingTranslation}
            trackingEvent={TrackingEvent.ContentTranslated('feed_post', post.id)}
          />
        )}
        {!!post.images?.length && <ImageCarousel images={post.images} style={styles.carousel} />}
        {!!post.linkPreview && (
          <View style={styles.blockContainer}>
            <HoliLinkPreview previewData={post.linkPreview} />
          </View>
        )}
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme, sm = false, contentSpacing: number) =>
  StyleSheet.create({
    container: {
      borderRadius: Spacing.xs,
      paddingTop: Spacing.md,
    },
    metadata: {
      alignContent: 'space-between',
    },
    contentSection: {
      gap: contentSpacing,
      marginTop: contentSpacing,
    },
    description: { width: '100%' },
    pillContainer: {
      marginVertical: Spacing.md,
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
    blockContainer: {
      marginTop: Spacing.md,
      paddingHorizontal: sm ? Spacing.md : 0,
      width: '100%',
    },
    carousel: {
      paddingVertical: Spacing.sm,
    },
  })

export default PostContent
