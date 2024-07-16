import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
import { Term } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { GlobalFilled, HoliLogoFilled } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type PostContentProps = {
  post: FeedPost
  showVisibilityBadge?: boolean
  aggregatedTopics?: Term[]
}

const PostContent = ({ post, showVisibilityBadge, aggregatedTopics }: PostContentProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const contentSpacing = screenWidth < dimensions.breakpointS ? Spacing.xs : Spacing.md
  const smStyle = useBreakpointMatcher([[dimensions.breakpointS, true]])
  const styles = useMemo(() => getStyles(theme, !!smStyle, contentSpacing), [theme, smStyle, contentSpacing])

  return (
    <>
      <View style={styles.container} testID="post-content-container">
        {showVisibilityBadge && (
          <View style={styles.badgeContainer}>
            <HoliIcon
              icon={post.visibility === VisibilityLevel.PUBLIC ? GlobalFilled : HoliLogoFilled}
              color={theme.colors.foreground30}
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
        <View style={styles.pillContainer}>
          <View style={[styles.pill, styles.categoryPill]}>
            <HoliText size="small" numberOfLines={1}>
              {post.category.label}
            </HoliText>
          </View>
          {aggregatedTopics?.map((topic) => (
            <View style={[styles.pill, styles.topicPill]} key={topic.id}>
              <HoliText size="small" numberOfLines={1}>
                {topic.title}
              </HoliText>
            </View>
          ))}
        </View>
        <View style={styles.contentSection}>
          <HoliHeading level="1" size="m" numberOfLines={3}>
            {post.title}
          </HoliHeading>
          <HoliRichTextOutput text={post.description} allowAllLinks users={post.mentionedUsers || []} />
        </View>
        {!!post.imageUrl && (
          <View style={[styles.imageContainer, styles.blockContainer]}>
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
        )}
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
    imageContainer: {
      marginTop: contentSpacing,
      ...(!sm
        ? {
            borderRadius: Spacing.xxs,
            aspectRatio: 16 / 9,
            overflow: 'hidden',
          }
        : {}),
    },
    image: {
      ...(sm
        ? {
            borderRadius: Spacing.xxs,
            width: '100%',
            aspectRatio: 16 / 9,
            overflow: 'hidden',
          }
        : {}),
      height: '100%',
    },
  })

export default PostContent
