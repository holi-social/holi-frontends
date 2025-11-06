import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import { SavedEngagements } from '@holi/core/screens/userprofile/MyEngagementsTab/SavedEngagements'
import { FavoritesSlider } from '@holi/core/screens/userprofile/MyEngagementsTab/FavoritesSlider'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

export const MyEngagementsTab = () => {
  const [showFavoritesSlider] = useFeatureFlag(FeatureFlagKey.FAVORITES_SLIDER)
  return (
    <Stack gap="xs" padding={{ bottom: 'xs' }}>
      {showFavoritesSlider && <FavoritesSlider />}
      <SavedEngagements />
    </Stack>
  )
}
