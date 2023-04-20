import { useQuery } from '@apollo/client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import type { Post } from '@holi/core/screens/posts/types'
import { SpaceByIdResponse, spacePostsQuery } from '@holi/core/screens/spaces/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'

export interface SpaceUpdatesTabProps {
  space: Space
}

const SpaceUpdatesTab = ({ space }: SpaceUpdatesTabProps) => {
  const hasPostFilterRef = useRef(false)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const postGridItemsInRow = useBreakpointMatcher()

  const [filter, setFilter] = useState(VisibilityFilter.ALL)
  const { error, data, loading } = useQuery<SpaceByIdResponse>(spacePostsQuery, {
    variables: { idOrName: space.id, offset: 0, limit: 10, visibility: filter },
  })

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const headline = isMember ? t('spaces.updates.noResults.headline.member') : t('spaces.updates.noResults.headline')
  const hasPostFilter = hasPostFilterRef.current
  const postData = data?.spaceById.posts?.data
  const posts = useMemo(() => postData || [], [postData])

  // TODO: the filtering of public posts should be marked/flagged on the backend.
  useEffect(() => {
    if (hasPostFilterRef.current) return

    hasPostFilterRef.current = hasPublicAndPrivatePosts(posts)
    ;() => (hasPostFilterRef.current = false)
  }, [posts, postData])

  if (error) {
    displayError(error, t('spaces.updates.error'))
  }

  const isFilterAll = filter === VisibilityFilter.ALL
  const isFilterPublic = filter === VisibilityFilter.PUBLIC
  const isFilterMembers = filter === VisibilityFilter.MEMBERS

  // FIXME: gap not supported in current react-native version for mobile
  //  using different stylings for platforms and param for checking if item is last in row
  //  remove workaround when updated to RN 0.71.0
  const setButtonStyles = (isSelected: boolean, isLast: boolean) =>
    StyleSheet.flatten([styles.buttonSpacing, isLast ? {} : styles.buttonGap, isSelected ? styles.buttonSelected : {}])

  return (
    <>
      {!loading && posts.length === 0 ? (
        <HoliBox padding={24}>
          <HoliNoResults
            firstText={t('spaces.updates.noResults.tagline')}
            secondText={headline}
            media={
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/spaceUpdatesEmptyState.svg')}
                label=""
                height={203}
                width={279}
                isSvg
              />
            }
          />
        </HoliBox>
      ) : (
        <HoliBox padding={[12, 0, 0, 0]}>
          {isMember && hasPostFilter && (
            <ScrollView horizontal contentContainerStyle={styles.buttonContainer} style={styles.buttonWrapper}>
              <HoliButton
                type="secondary"
                label={t('spaces.updates.filter.all')}
                onPress={() => setFilter(VisibilityFilter.ALL)}
                style={setButtonStyles(isFilterAll, false)}
              >
                <HoliText
                  size="small"
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  color={isFilterAll ? 'white100' : 'black300'}
                >
                  {t('spaces.updates.filter.all')}
                </HoliText>
              </HoliButton>
              <HoliButton
                type="secondary"
                label={t('spaces.updates.filter.public')}
                onPress={() => setFilter(VisibilityFilter.PUBLIC)}
                style={setButtonStyles(isFilterPublic, false)}
              >
                <HoliIcon
                  icon={'global'}
                  size={14}
                  filled={true}
                  color={isFilterPublic ? colors.white100 : colors.foreground30}
                  style={styles.icon}
                />
                <HoliText
                  size="small"
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  color={isFilterPublic ? 'white100' : 'black300'}
                >
                  {t('spaces.updates.filter.public')}
                </HoliText>
              </HoliButton>
              <HoliButton
                type="secondary"
                label={t('spaces.updates.filter.members')}
                onPress={() => setFilter(VisibilityFilter.MEMBERS)}
                style={setButtonStyles(isFilterMembers, true)}
              >
                <HoliIcon
                  icon="lock"
                  size={14}
                  filled={true}
                  color={isFilterMembers ? colors.white100 : colors.foreground30}
                  style={styles.icon}
                />
                <HoliText
                  size="small"
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  color={isFilterMembers ? 'white100' : 'black300'}
                >
                  {t('spaces.updates.filter.members')}
                </HoliText>
              </HoliButton>
            </ScrollView>
          )}
          {loading ? (
            <HoliBox padding={24}>
              <HoliLoader />
            </HoliBox>
          ) : (
            <HoliBox padding={[0, 24, 24, 24]}>
              <HoliGridWrapper itemsInRow={postGridItemsInRow} style={styles.wrapper}>
                {
                  /** FIXME convert to VirtualizedList, FlatList or SectionList */
                  posts.map((post) => (
                    <HoliGridCell key={post.id}>
                      <PostPreview post={post} spaceIdOrName={space.id} hasVisibilityIcon />
                    </HoliGridCell>
                  ))
                }
              </HoliGridWrapper>
            </HoliBox>
          )}
        </HoliBox>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  buttonWrapper: {
    paddingVertical: 12,
  },
  wrapper: {
    paddingTop: 12,
  },
  buttonGap: {
    marginRight: 8,
  },
  buttonSpacing: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    flex: 1,
    ...Platform.select({
      web: {
        minWidth: 'fit-content',
        maxWidth: '33%',
      },
    }),
  },
  buttonSelected: {
    backgroundColor: colors.foreground30,
    borderColor: colors.foreground30,
  },
  icon: {
    marginRight: 5,
  },
})

// TODO: the filtering of public posts should be marked/flagged on the backend.
function hasPublicAndPrivatePosts(posts: Post[]) {
  let hasPublicPost = false
  let hasPrivatePost = false

  for (const post of posts) {
    if (hasPublicPost && hasPrivatePost) break
    if (post.isPublic) {
      hasPublicPost = true
      continue
    }
    hasPrivatePost = true
  }

  return hasPublicPost && hasPrivatePost
}

export const SpaceUpdatesTabLazy = dynamicImport<SpaceUpdatesTabProps>(
  () => import('@holi/core/screens/spaces/components/SpaceUpdatesTab')
)

export default SpaceUpdatesTab
