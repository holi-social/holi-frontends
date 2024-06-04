import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import { FeatureToggleStatus, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'

const createFeatureToggleQuery = (featureToggles: { name: FeatureToggleName; status: FeatureToggleStatus }[]) => ({
  request: {
    query: featureTogglesQuery,
  },
  result: {
    data: {
      featureToggles,
    },
  },
})

describe('FeatureToggleGuard', () => {
  it('should not render the feature component for unsupported feature', async () => {
    const featureText = 'secret-feature-flag'
    const mocks = [
      createFeatureToggleQuery([
        {
          name: FeatureToggleName.CHAT,
          status: FeatureToggleStatus.PRODUCTION,
        },
        {
          name: FeatureToggleName.NOTIFICATIONS,
          status: FeatureToggleStatus.PRODUCTION,
        },
      ]),
    ]

    const unsupportedFeatureToggle = FeatureToggleName.INDIVIDUALS_POST

    render(
      <MockedProvider mocks={mocks}>
        <FeatureToggleGuard toggleName={unsupportedFeatureToggle} featureNameKey={'someFeatureNameKey'}>
          <HoliText>{featureText}</HoliText>
        </FeatureToggleGuard>
      </MockedProvider>
    )

    expect(await screen.findByTestId('feature-toggle-guard-loader')).toBeOnTheScreen()

    await waitFor(() => {
      expect(screen.queryByTestId('feature-toggle-guard-loader')).not.toBeOnTheScreen()
      expect(screen.queryByText(featureText)).not.toBeOnTheScreen()
    })
  })

  it('should render the feature component on PRODUCTION flag', async () => {
    const featureText = 'secret-feature-flag'
    const mocks = [
      createFeatureToggleQuery([
        {
          name: FeatureToggleName.CHAT,
          status: FeatureToggleStatus.PRODUCTION,
        },
        {
          name: FeatureToggleName.NOTIFICATIONS,
          status: FeatureToggleStatus.PRODUCTION,
        },
      ]),
    ]

    render(
      <MockedProvider mocks={mocks}>
        <FeatureToggleGuard toggleName={FeatureToggleName.CHAT} featureNameKey={'chat.title'}>
          <HoliText>{featureText}</HoliText>
        </FeatureToggleGuard>
      </MockedProvider>
    )

    expect(await screen.findByTestId('feature-toggle-guard-loader')).toBeOnTheScreen()

    await waitFor(() => {
      expect(screen.queryByTestId('feature-toggle-guard-loader')).not.toBeOnTheScreen()
      expect(screen.queryByText(featureText)).toBeOnTheScreen()
    })
  })

  it('should not render the feature component on OFF flag', async () => {
    const featureText = 'secret-feature-flag'
    const mocks = [
      createFeatureToggleQuery([
        {
          name: FeatureToggleName.NOTIFICATIONS,
          status: FeatureToggleStatus.OFF,
        },
      ]),
    ]

    render(
      <MockedProvider mocks={mocks}>
        <FeatureToggleGuard toggleName={FeatureToggleName.NOTIFICATIONS} featureNameKey={'notifications.title'}>
          <HoliText>{featureText}</HoliText>
        </FeatureToggleGuard>
      </MockedProvider>
    )

    expect(await screen.findByTestId('feature-toggle-guard-loader')).toBeOnTheScreen()
    await waitFor(() => {
      expect(screen.queryByTestId('feature-toggle-guard-loader')).not.toBeOnTheScreen()
      expect(screen.queryByText(featureText)).not.toBeOnTheScreen()
    })
  })

  it('should render the maintenance mode component', async () => {
    const featureText = 'secret-feature-flag'
    const mocks = [
      createFeatureToggleQuery([
        {
          name: FeatureToggleName.CHAT,
          status: FeatureToggleStatus.MAINTENANCE,
        },
      ]),
    ]

    render(
      <MockedProvider mocks={mocks}>
        <FeatureToggleGuard toggleName={FeatureToggleName.CHAT} featureNameKey={'chat.title'}>
          <HoliText>{featureText}</HoliText>
        </FeatureToggleGuard>
      </MockedProvider>
    )

    expect(await screen.findByTestId('feature-toggle-guard-loader')).toBeOnTheScreen()
    expect(await screen.findByText('global.maintenance.description')).toBeOnTheScreen()
    expect(screen.queryByTestId('feature-toggle-guard-loader')).not.toBeOnTheScreen()
    expect(screen.queryByText(featureText)).not.toBeOnTheScreen()
  })
})
