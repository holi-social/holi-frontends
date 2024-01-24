import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useFallbackImage } from '@holi/core/helpers'
import { Post } from '@holi/core/screens/posts/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { getFormattedDate } from '@holi/ui/components/molecules/HoliMediaHeader'
import { colors } from '@holi/ui/styles/globalVars'

export const inspirationPostCategoryList = [
  {
    slug: 'event-recommendation',
    image: require('@holi/ui/assets/img/illustrations/daily-inspirations/event-recommendation.svg'),
  },
  {
    slug: 'tip-of-the-day',
    image: require('@holi/ui/assets/img/illustrations/daily-inspirations/tip-of-the-day.svg'),
  },
  {
    slug: 'people-of-change',
    image: require('@holi/ui/assets/img/illustrations/daily-inspirations/people-of-change.svg'),
  },
  {
    slug: 'helping-hand',
    image: require('@holi/ui/assets/img/illustrations/daily-inspirations/helping-hand.svg'),
  },
  {
    slug: 'insight-highlight',
    image: require('@holi/ui/assets/img/illustrations/daily-inspirations/insight-highlight.svg'),
  },
  {
    slug: 'news-of-the-app',
    image: require('@holi/ui/assets/img/illustrations/daily-inspirations/news-of-the-app.svg'),
  },
]

export interface InspirationPostMediaHeaderProps {
  post?: Post
}

const InspirationPostMediaHeader = ({ post }: InspirationPostMediaHeaderProps) => {
  const { i18n } = useTranslation()
  const inspirationPostCategory = inspirationPostCategoryList.filter(
    (t) => post?.inspirationPostCategory?.slug.toLowerCase() === t.slug
  )[0]
  const categoryImgSrc = inspirationPostCategory?.image
  const fallbackImageUri = useFallbackImage().uri

  if (!post) return null

  return (
    !!post?.inspirationPostCategory && (
      <View style={styles.inspirationMediaHeader}>
        <View style={styles.inspirationHeadingRow}>
          {categoryImgSrc ? (
            <HoliLocalImage imageSource={categoryImgSrc} width={32} height={32} label="" isSvg />
          ) : (
            <HoliImage label="" source={{ uri: fallbackImageUri }} style={styles.fallbackImage} />
          )}
          {!!post?.inspirationPostCategory?.title && <HoliHeading>{post?.inspirationPostCategory?.title}</HoliHeading>}
        </View>
        <HoliText size="small" style={styles.inspirationDate}>
          {/*
            converting given timestamp to a date first (with '00:00:00' as time)
            to show the real days instead of exact timestamp calculations
           */}
          {getFormattedDate(new Date(post?.modified + '').toDateString(), i18n)}
        </HoliText>
      </View>
    )
  )
}

export default InspirationPostMediaHeader

const styles = StyleSheet.create({
  inspirationMediaHeader: {
    gap: 16,
  },
  inspirationHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fallbackImage: {
    width: 32,
    height: 32,
  },
  inspirationDate: {
    paddingBottom: 8,
    color: colors.foreground20,
  },
})
