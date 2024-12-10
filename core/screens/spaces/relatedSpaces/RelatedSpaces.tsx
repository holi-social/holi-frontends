import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, View, useWindowDimensions } from 'react-native'

import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import type { RefreshOnNavigationParams } from '@holi/core/hooks/useRefreshOnNavigation'
import type { TabNavigationParams } from '@holi/core/hooks/useTabNavigation'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { spaceRelatedSpacesQuery } from '@holi/core/screens/spaces/queries'
import type { RelatedSpace, Space } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

export type SpaceRelatedSpacesParams = RefreshOnNavigationParams &
  TabNavigationParams & {
    spaceIdOrName: string
  }

const { useParam } = createParamHooks<SpaceRelatedSpacesParams>()

interface RelatedSpaceSection {
  id: 'parentSpace' | 'childSpaces'
  title: string
  data: RelatedSpace[]
}

const SPACE_BLOCK_ITEM_HEIGHT = 80

const RelatedSpaces = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme
  const backgroundColor = colors.white200

  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { height } = useWindowDimensions()
  const spaceFetchLimit = Math.ceil(height / SPACE_BLOCK_ITEM_HEIGHT) // load enough items to fill the screen

  const {
    data: { spaceById: space } = {},
    loading,
    fetchMore,
  } = useQuery<{ spaceById: Pick<Space, 'id' | 'name' | 'title' | 'parentSpace' | 'childSpaces'> }>(
    spaceRelatedSpacesQuery,
    {
      variables: { idOrName: spaceIdOrName, offset: 0, limit: spaceFetchLimit },
      fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network', // ensures that all required fields are eventually present for members
      skip: !spaceIdOrName,
    }
  )

  const fetchMoreChildSpaces = () => {
    fetchMore({ variables: { offset: space?.childSpaces?.data.length ?? 0 } })
  }

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: space?.title,
      headerStyle: { backgroundColor },
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [backgroundColor, setScreenOptions, space?.title])

  const throttledScrollEventProps = useThrottledMobileScrollEvents()

  const relatedSections = useMemo(
    () =>
      [
        space?.parentSpace
          ? {
              id: 'parentSpace',
              title: t('spaces.spaceDetails.networkSpace'),
              data: space?.parentSpace ? [space?.parentSpace] : [],
            }
          : null,
        space?.childSpaces?.data.length
          ? {
              id: 'childSpaces',
              title: t('spaces.spaceDetails.linkedSpaces'),
              data: space?.childSpaces?.data ? [...space.childSpaces.data] : [],
            }
          : null,
      ].filter(Boolean) as RelatedSpaceSection[],
    [space?.childSpaces, space?.parentSpace, t]
  )

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <HoliLoader testID="initial-loader" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <HoliContainer flex={1}>
        <SectionList
          sections={relatedSections}
          keyExtractor={({ id }, idx) => id + idx}
          renderItem={({ item: relatedSpace, section }) => (
            <View>
              <HoliBlockItem
                {...relatedSpace}
                label={relatedSpace.title}
                imageElement={<SpaceAvatar space={relatedSpace} size="lg" />}
                users={relatedSpace.members.data.map((membership) => membership.user)}
                totalUserCount={relatedSpace.members.totalResults}
                href={`/spaces/${relatedSpace.id}`}
                testID={`${section.id === 'parentSpace' ? 'main' : 'child'}-space-item`}
              />
              <HoliGap size="s" />
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <HoliBox padding={[Spacing.xxs, 0, Spacing.md, 0]}>
              <HoliHeading size="s">{section.title}</HoliHeading>
            </HoliBox>
          )}
          stickySectionHeadersEnabled={false}
          onEndReached={fetchMoreChildSpaces}
          {...throttledScrollEventProps}
          style={{ flex: 1 }}
          testID="related-spaces-list"
        />
      </HoliContainer>
    </View>
  )
}
export default withProfiler(memo(RelatedSpaces), { name: 'RelatedSpaces' })
