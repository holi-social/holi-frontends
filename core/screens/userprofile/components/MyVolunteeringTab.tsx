import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import { MyVolunteeringTabEngagements } from '@holi/core/screens/userprofile/components/MyVolunteeringTabEngagements'
import { MyVolunteeringTabFavorites } from '@holi/core/screens/userprofile/components/MyVolunteeringTabFavorites'

export const MyVolunteeringTab = () => {
  return (
    <Stack gap="xs" padding={{ bottom: 'xs' }}>
      <MyVolunteeringTabFavorites />
      <MyVolunteeringTabEngagements />
    </Stack>
  )
}
