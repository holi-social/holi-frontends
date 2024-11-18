import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import type { SpacesByMemberIdResponse } from '@holi/core/screens/spaces/queries'
import { spacesByMemberIdQuery } from '@holi/core/screens/spaces/queries'
import type { SpaceForMember } from '@holi/core/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

export interface SpacesTabProps {
  memberId: string
  emptyText: string
  emptyCallToAction?: string
}

const SpacesTab = ({ emptyText, emptyCallToAction, memberId }: SpacesTabProps) => {
  const { data, refetch } = useQuery<SpacesByMemberIdResponse>(spacesByMemberIdQuery, {
    variables: { memberId },
    onError: (error) =>
      logError(error, 'Failed to load spaces for user', { location: 'SpacesTab.spacesByMemberIdQuery' }),
  })
  useOnRefresh(refetch)

  const spaces = data?.spaces

  const animKey = !data ? 'loading' : data.spaces.totalResults > 0 ? 'ready' : 'empty'

  return (
    <HoliTransition.FadeSwitch animKey={animKey}>
      {animKey === 'loading' && (
        <HoliBox padding={[Spacing.xs, 0]}>
          {Array.from({ length: 10 }, (_, index) => index).map((index) => (
            <HoliBox
              key={index}
              padding={[0, 0, 32, 0]}
              layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignSelf: 'center' }}
            >
              <HoliBlockItem loading testID="space-tab-loading" />
            </HoliBox>
          ))}
        </HoliBox>
      )}

      {animKey === 'ready' && (
        <HoliBox padding={[Spacing.xs, 0]}>
          {spaces?.data.map((space: SpaceForMember) => (
            <HoliBox
              key={space.id}
              padding={[0, 0, 32, 0]}
              layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignSelf: 'center' }}
            >
              <HoliBlockItem
                label={space.title}
                title={space.title}
                imageElement={<SpaceAvatar space={space} size={'lg'} />}
                users={space.members.data.map((membership) => membership.user)}
                href={`/spaces/${space.name}`}
                testID="space-tab"
                totalUserCount={space.members.totalResults}
              />
            </HoliBox>
          ))}
        </HoliBox>
      )}

      {animKey === 'empty' && <EmptyTab text={emptyText} callToAction={emptyCallToAction} />}
    </HoliTransition.FadeSwitch>
  )
}

export default withProfiler(SpacesTab, { name: 'SpacesTab' })
