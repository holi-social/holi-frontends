import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import { MyVolunteeringTabEngagements } from '@holi/core/screens/userprofile/components/MyVolunteeringTabEngagements'
import { MyVolunteeringTabFavorites } from '@holi/core/screens/userprofile/components/MyVolunteeringTabFavorites'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

export const MyVolunteeringTab = () => {
  const [showFavoritesSlider] = useFeatureFlag(FeatureFlagKey.FAVORITES_SLIDER)
  return (
    <Stack gap="xs" padding={{ bottom: 'xs' }}>
      {showFavoritesSlider && <MyVolunteeringTabFavorites />}
      <MyVolunteeringTabEngagements />
    </Stack>
  )
}
