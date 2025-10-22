import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import { SavedEngagements } from '@holi/core/screens/userprofile/MyVolunteeringTab/SavedEngagements'
import { FavoritesSlider } from '@holi/core/screens/userprofile/MyVolunteeringTab/FavoritesSlider'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { SavedPetitions } from '@holi/core/screens/userprofile/MyVolunteeringTab/SavedPetitions'

export const MyVolunteeringTab = () => {
  const [showFavoritesSlider] = useFeatureFlag(FeatureFlagKey.FAVORITES_SLIDER)
  // const [showPetitions] = useFeatureFlag(FeatureFlagKey.INNIT_PETITIONS)
  const showPetitions = true // mock -> todo: enable when feature flag is ready
  return (
    <Stack gap="xs" padding={{ bottom: 'xs' }}>
      {showFavoritesSlider && <FavoritesSlider />}
      <SavedEngagements />
      {showPetitions && <SavedPetitions />}
    </Stack>
  )
}
