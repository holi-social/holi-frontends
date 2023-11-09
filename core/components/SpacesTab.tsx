import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React from 'react'
import { View } from 'react-native'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import type { SpacesByMemberIdResponse } from '@holi/core/screens/spaces/queries'
import { spacesByMemberIdQuery } from '@holi/core/screens/spaces/queries'
import type { Space } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface SpacesTabProps {
  memberId: string
  emptyText: string
  emptyCallToAction?: string
}

const SpacesTab = ({ emptyText, emptyCallToAction, memberId }: SpacesTabProps) => {
  const mixins = useStyleMixins()
  const { data } = useQuery<SpacesByMemberIdResponse>(spacesByMemberIdQuery, {
    variables: { memberId },
    fetchPolicy: 'network-only',
    onError: (error) =>
      logError(error, 'Failed to load spaces for user', { location: 'SpacesTab.spacesByMemberIdQuery' }),
  })

  if (!data) return null
  const spaces = data.spaces

  return spaces.totalResults > 0 ? (
    <HoliBox padding={24}>
      <View style={mixins.container}>
        {spaces.data.map((space: Space) => (
          <HoliBox
            key={space.id}
            padding={[0, 0, 32, 0]}
            layout={{ maxWidth: vars.maxScreenWidth, width: '100%', alignSelf: 'center' }}
          >
            <HoliBlockItem
              label={space.title}
              title={space.title}
              imageElement={<SpaceAvatar space={space} size={'large'} />}
              users={space.members.data.map((membership) => membership.user)}
              href={`/spaces/${space.name}`}
              testID="space-tab"
              totalUserCount={space.members.totalResults}
            />
          </HoliBox>
        ))}
      </View>
    </HoliBox>
  ) : (
    <EmptyTab text={emptyText} callToAction={emptyCallToAction} />
  )
}

export default withProfiler(SpacesTab, { name: 'SpacesTab' })
