import { render, screen } from '@testing-library/react-native'
import React from 'react'

import FeatureFlagGuard from '@holi/core/featureFlags/components/FeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { Text } from 'holi-bricks/components/text'

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

describe('FeatureFlagGuard', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render children when flag is true', () => {
    mockUseFeatureFlag.mockReturnValue([true, undefined])
    const testText = 'Feature content'

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.THEME_TOGGLE}>
        <Text>{testText}</Text>
      </FeatureFlagGuard>
    )

    expect(screen.getByText(testText)).toBeOnTheScreen()
  })

  it('should render children when flag is truthy string', () => {
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
    const testText = 'Feature content'

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.CHAT}>
        <Text>{testText}</Text>
      </FeatureFlagGuard>
    )

    expect(screen.getByText(testText)).toBeOnTheScreen()
  })

  it('should not render children when flag is false', () => {
    mockUseFeatureFlag.mockReturnValue([false, undefined])
    const testText = 'Feature content'

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.THEME_TOGGLE}>
        <Text>{testText}</Text>
      </FeatureFlagGuard>
    )

    expect(screen.queryByText(testText)).not.toBeOnTheScreen()
  })

  it('should not render children when flag is undefined', () => {
    mockUseFeatureFlag.mockReturnValue([undefined, undefined])
    const testText = 'Feature content'

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.STORAGE}>
        <Text>{testText}</Text>
      </FeatureFlagGuard>
    )

    expect(screen.queryByText(testText)).not.toBeOnTheScreen()
  })

  it('should not render children when flag is empty string', () => {
    mockUseFeatureFlag.mockReturnValue(['', undefined])
    const testText = 'Feature content'

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.DONATIONS}>
        <Text>{testText}</Text>
      </FeatureFlagGuard>
    )

    expect(screen.queryByText(testText)).not.toBeOnTheScreen()
  })

  it('should not render children when flag is "off"', () => {
    mockUseFeatureFlag.mockReturnValue(['off', undefined])
    const testText = 'Feature content'

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.NOTIFICATIONS}>
        <Text>{testText}</Text>
      </FeatureFlagGuard>
    )

    expect(screen.queryByText(testText)).not.toBeOnTheScreen()
  })

  it('should call useFeatureFlag with correct flag key', () => {
    mockUseFeatureFlag.mockReturnValue([true, undefined])

    render(
      <FeatureFlagGuard flag={FeatureFlagKey.CHAT}>
        <Text>Content</Text>
      </FeatureFlagGuard>
    )

    expect(mockUseFeatureFlag).toHaveBeenCalledWith(FeatureFlagKey.CHAT)
  })
})
