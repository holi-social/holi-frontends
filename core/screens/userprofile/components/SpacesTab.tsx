import { useQuery } from '@apollo/client'
import React from 'react'
import { Text } from 'react-native'

import { spacesByMemberIdQuery } from '@holi/core/screens/spaces/queries'
import type { SpacesByMemberIdResponse } from '@holi/core/screens/spaces/queries'

interface Props {
  memberId: string
}

const SpacesTab = ({ memberId }: Props) => {
  useQuery<SpacesByMemberIdResponse>(spacesByMemberIdQuery, {
    variables: { memberId },
  })

  return <Text>Hi </Text>
}

export default SpacesTab
