import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliMediaAuthorHeader from '@holi/core/components/HoliMediaAuthorHeader'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { FeedPost, VisibilityLevel } from '@holi/core/screens/individualPosts/types'
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
}

const PostContent = ({ post, showVisibilityBadge }: PostContentProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const smStyle = useBreakpointMatcher([[dimensions.breakpointS, true]])
  const styles = useMemo(() => getStyles(theme, !!smStyle), [theme, smStyle])

  return (
    <>
      <View style={styles.container}>
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
        <HoliMediaAuthorHeader author={post.creator} authorBold date={post.createdAt} />
        <View>
          <View style={[styles.pill, styles.categoryPill]}>
            <HoliText size="small" numberOfLines={1}>
              {post.category.label}
            </HoliText>
          </View>
        </View>
        <View style={styles.contentSection}>
          <HoliHeading level="1" size="m" numberOfLines={3}>
            {post.title}
          </HoliHeading>
          <HoliRichTextOutput text={post.description} allowAllLinks />
        </View>
        {!!post.image && (
          <View style={[styles.imageContainer, styles.blockContainer]}>
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
        {!!post.linkPreview && (
          <View style={styles.blockContainer}>
            <HoliLinkPreview previewData={post.linkPreview} />
          </View>
        )}
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme, sm = false) =>
  StyleSheet.create({
    container: {
      borderRadius: Spacing.xs,
      gap: Spacing.md,
      paddingTop: Spacing.md,
    },
    metadata: {
      alignContent: 'space-between',
    },
    contentSection: {
      gap: Spacing.md,
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
    blockContainer: {
      paddingHorizontal: sm ? Spacing.md : 0,
      width: '100%',
    },
    imageContainer: {
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
