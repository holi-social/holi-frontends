import { renderRouter, screen, waitFor } from 'expo-router/testing-library'
import React from 'react'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliText from '@holi/ui/components/atoms/HoliText'

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

const mockFeatureFlags = (on: FeatureFlagKey[], off: FeatureFlagKey[] = [], maintenance: FeatureFlagKey[] = []) => {
  mockUseFeatureFlag.mockImplementation((flag: FeatureFlagKey) => {
    if (on.includes(flag)) return ['on', undefined]
    else if (off.includes(flag)) return ['off', undefined]
    else if (maintenance.includes(flag)) return ['maintenance', undefined]
    return undefined
  })
}

describe('PosthogFeatureFlagGuard', () => {
  it('should not render the feature component for unsupported key', async () => {
    const featureText = 'secret-feature-flag'
    mockFeatureFlags([FeatureFlagKey.DONATIONS], [], [])
    const unsupportedFeatureFlag = FeatureFlagKey.STORAGE

    renderRouter({
      index: () => (
        <PosthogFeatureFlagGuard featureFlagKey={unsupportedFeatureFlag} i18nKey={'someFeatureNameKey'}>
          <HoliText>{featureText}</HoliText>
        </PosthogFeatureFlagGuard>
      ),
    })

    await waitFor(() => expect(screen.queryByText(featureText)).not.toBeOnTheScreen())
  })

  it('should render the feature component if flag set to "on"', async () => {
    const featureText = 'secret-feature-flag'
    mockFeatureFlags([FeatureFlagKey.CHAT])

    renderRouter({
      index: () => (
        <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.CHAT} i18nKey={'chat.title'}>
          <HoliText>{featureText}</HoliText>
        </PosthogFeatureFlagGuard>
      ),
    })

    await waitFor(() => expect(screen.queryByText(featureText)).toBeOnTheScreen())
  })

  it('should not render the feature component if flag set to "off"', async () => {
    const featureText = 'secret-feature-flag'
    mockFeatureFlags([], [FeatureFlagKey.NOTIFICATIONS])

    renderRouter({
      index: () => (
        <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.NOTIFICATIONS} i18nKey={'notifications.title'}>
          <HoliText>{featureText}</HoliText>
        </PosthogFeatureFlagGuard>
      ),
    })

    await waitFor(() => {
      expect(screen.queryByText(featureText)).not.toBeOnTheScreen()
    })
  })

  it('should render the maintenance mode component if flag set to "maintenance"', async () => {
    const featureText = 'secret-feature-flag'
    mockFeatureFlags([], [], [FeatureFlagKey.CHAT])

    renderRouter({
      index: () => (
        <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.CHAT} i18nKey={'chat.title'}>
          <HoliText>{featureText}</HoliText>
        </PosthogFeatureFlagGuard>
      ),
    })

    expect(await screen.findByText('global.maintenance.description')).toBeOnTheScreen()
    expect(screen.queryByText(featureText)).not.toBeOnTheScreen()
  })
})
