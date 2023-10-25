import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { POSTS_PAGE_SIZE } from '@holi/core/screens/homeFeed/components/InspirationPosts'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const InspirationPostsList = () => {
  const { loading, data: posts, totalResults } = usePaginationContext<Post>()

  const { t } = useTranslation()

  const postGridItemsInRow = useBreakpointMatcher()
  const mixins = useStyleMixins()

  if (!loading && !totalResults) return <></>

  return (
    <View style={mixins.container}>
      <HoliHeading size="large">{t('homeFeed.inspirationPosts.heading')}</HoliHeading>
      <HoliBox padding={[24, 0, 24, 0]}>
        <HoliGridWrapper itemsInRow={postGridItemsInRow}>
          {loading
            ? new Array(POSTS_PAGE_SIZE).fill(1).map((_, idx) => (
                <HoliGridCell key={idx}>
                  <PostPreview style={styles.item} loading />
                </HoliGridCell>
              ))
            : posts.map((post) => (
                <HoliGridCell key={post.id}>
                  <PostPreview post={post} />
                </HoliGridCell>
              ))}
        </HoliGridWrapper>
      </HoliBox>
    </View>
  )
}

const styles = StyleSheet.create({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
  item: {
    flex: 1,
  },
})

export default InspirationPostsList
