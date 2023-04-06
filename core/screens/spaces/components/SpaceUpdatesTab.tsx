import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { SpaceByIdResponse, spacePostsQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceConnectionType, VisibilityFilter } from '@holi/core/screens/spaces/types'
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
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const postGridItemsInRow = useBreakpointMatcher()
  const [filter, setFilter] = useState(VisibilityFilter.ALL)
  const { error, data, loading } = useQuery<SpaceByIdResponse>(spacePostsQuery, {
    variables: { idOrName: space.id, offset: 0, limit: 10, visibility: filter },
  })

  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const headline = isMember ? t('spaces.updates.noResults.headline.member') : t('spaces.updates.noResults.headline')

  if (error) {
    displayError(error, t('spaces.updates.error'))
  }

  const posts = data?.spaceById.posts?.data || []

  const isFilterAll = filter === VisibilityFilter.ALL
  const isFilterPublic = filter === VisibilityFilter.PUBLIC
  const isFilterMembers = filter === VisibilityFilter.MEMBERS

  const setButtonStyles = (isSelected: boolean) => (isSelected ? styles.buttonSelected : styles.buttonUnselected)

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
        <HoliBox padding={12}>
          {isMember && (
            <HoliGridWrapper itemsInRow={3} gap={8} style={styles.wrapper}>
              <HoliGridCell>
                <HoliButton
                  type="secondary"
                  label={t('spaces.updates.filter.all')}
                  onPress={() => setFilter(VisibilityFilter.ALL)}
                  style={setButtonStyles(isFilterAll)}
                >
                  <HoliText size="small" color={isFilterAll ? 'white100' : 'black300'}>
                    {t('spaces.updates.filter.all')}
                  </HoliText>
                </HoliButton>
              </HoliGridCell>
              <HoliGridCell>
                <HoliButton
                  type="secondary"
                  label={t('spaces.updates.filter.public')}
                  onPress={() => setFilter(VisibilityFilter.PUBLIC)}
                  style={setButtonStyles(isFilterPublic)}
                >
                  <HoliIcon
                    icon={'global'}
                    size={14}
                    filled={true}
                    color={isFilterPublic ? colors.white100 : colors.foreground30}
                    style={styles.icon}
                  />
                  <HoliText size="small" color={isFilterPublic ? 'white100' : 'black300'}>
                    {t('spaces.updates.filter.public')}
                  </HoliText>
                </HoliButton>
              </HoliGridCell>
              <HoliGridCell>
                <HoliButton
                  type="secondary"
                  label={t('spaces.updates.filter.members')}
                  onPress={() => setFilter(VisibilityFilter.MEMBERS)}
                  style={setButtonStyles(isFilterMembers)}
                >
                  <HoliIcon
                    icon="lock"
                    size={14}
                    filled={true}
                    color={isFilterMembers ? colors.white100 : colors.foreground30}
                    style={styles.icon}
                  />
                  <HoliText size="small" color={isFilterMembers ? 'white100' : 'black300'}>
                    {t('spaces.updates.filter.members')}
                  </HoliText>
                </HoliButton>
              </HoliGridCell>
            </HoliGridWrapper>
          )}
          {loading ? (
            <HoliBox padding={24}>
              <HoliLoader />
            </HoliBox>
          ) : (
            <HoliGridWrapper itemsInRow={postGridItemsInRow} style={styles.wrapper}>
              {
                /** FIXME convert to VirtualizedList, FlatList or SectionList */
                posts.map((post) => (
                  <HoliGridCell key={post.id}>
                    <PostPreview post={post} style={styles.postItem} />
                  </HoliGridCell>
                ))
              }
            </HoliGridWrapper>
          )}
        </HoliBox>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  postItem: {
    borderRadius: 12,
    paddingVertical: 24,
  },
  wrapper: {
    padding: 12,
  },
  buttonSelected: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: colors.foreground30,
    borderColor: colors.foreground30,
  },
  buttonUnselected: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: colors.white100,
    borderColor: colors.background30,
  },
  icon: {
    marginRight: 5,
  },
})

export const SpaceUpdatesTabLazy = dynamicImport<SpaceUpdatesTabProps>(
  () => import('@holi/core/screens/spaces/components/SpaceUpdatesTab')
)

export default SpaceUpdatesTab
