import { fireEvent, render, screen, within } from '@testing-library/react-native'
import React from 'react'

import NotificationSettingsList from '@holi/core/screens/notifications/components/NotificationSettingsList'
import NotificationSettingsMaintenance from '@holi/core/screens/notifications/components/NotificationSettingsMaintenance'
import { Channel } from '@holi/core/screens/notifications/hooks/useNotificationPreferences'

const mockUseNotificationPreferences = jest.fn()

jest.mock('@holi/core/screens/notifications/hooks/useNotificationPreferences', () => {
  const original = jest.requireActual('@holi/core/screens/notifications/hooks/useNotificationPreferences')
  return {
    ...original,
    useNotificationPreferences: () => mockUseNotificationPreferences(),
  }
})

const workflowPreferences = [
  {
    id: 'GLOBAL',
    category: 'GLOBAL',
    preferences: { push: false, email: true },
  },
  {
    id: 'POST_COMMENT_MENTION',
    category: 'POSTS_AND_COMMENTS',
    preferences: { push: false, email: null },
  },
  {
    id: 'SPACE_MEMBERSHIP_REQUEST',
    category: 'SPACES',
    preferences: { push: false, email: true },
  },
  {
    id: 'SPACE_NEW_POST',
    category: 'SPACES',
    preferences: { push: false, email: null },
  },
  {
    id: 'CHALLENGE_APPROVAL',
    category: 'CHALLENGES',
    preferences: { push: false, email: null },
  },
]

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
}))

jest.mock('@holi/ui/components/atoms/HoliLottie', () => ({
  __esModule: true,
  default: () => null,
}))

describe('NotificationSettingsList', () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
  })

  it('should correctly render loading state', () => {
    mockUseNotificationPreferences.mockReturnValue({
      loading: true,
    })
    const { root } = render(<NotificationSettingsList />)

    expect(root).toBeTruthy()
  })

  it('should correctly render grouped preferences', () => {
    mockUseNotificationPreferences.mockReturnValue({
      workflowPreferences,
    })
    render(<NotificationSettingsList />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should correctly render updating state', () => {
    mockUseNotificationPreferences.mockReturnValue({
      workflowPreferences: [workflowPreferences[0]],
      updatingPreferences: true,
    })
    render(<NotificationSettingsList />)

    expect(screen.getByTestId('GLOBAL')).toBeOnTheScreen()
  })

  it('should update global preferences', async () => {
    const updatePreference = jest.fn()
    mockUseNotificationPreferences.mockReturnValue({
      workflowPreferences,
      updatePreference,
    })
    render(<NotificationSettingsList />)

    const checkbox = within(screen.getByTestId('GLOBAL')).getByTestId('push')
    fireEvent.press(checkbox)

    expect(updatePreference).toHaveBeenCalledWith('GLOBAL', Channel.PUSH, true)
  })

  it('should update workflow preferences', async () => {
    const updatePreference = jest.fn()
    mockUseNotificationPreferences.mockReturnValue({
      workflowPreferences,
      updatePreference,
    })
    render(<NotificationSettingsList />)

    const checkbox = within(screen.getByTestId('SPACE_MEMBERSHIP_REQUEST')).getByTestId('email')
    fireEvent.press(checkbox)

    expect(updatePreference).toHaveBeenCalledWith('SPACE_MEMBERSHIP_REQUEST', Channel.EMAIL, false)
  })

  it('should correctly render maintenance state', () => {
    mockUseFeatureFlag.mockReturnValue(['maintenance', undefined])
    render(<NotificationSettingsMaintenance />)

    expect(screen.toJSON()).toMatchSnapshot()
  })
})
