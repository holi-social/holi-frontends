import { render } from '@testing-library/react-native'
import React from 'react'

import ActHome from '@holi/core/screens/act/ActHome.web'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { orderedSections } from '@holi/core/screens/act/sections'

const mockPosthog = jest.fn()
jest.mock('@holi/core/tracking/PosthogCrossPlatform', () => ({
  usePosthogCrossPlatform: () => mockPosthog(),
}))

jest.mock('@holi/core/navigation/hooks/useParam')

const mockActSection = jest.fn()
jest.mock('@holi/core/screens/act/ActSection', () => {
  const original = jest.requireActual('@holi/core/screens/act/ActSection')
  return {
    ...original,
    ActSection: (prop: { type: string }) => mockActSection(prop), // Mock ActSection
  }
})

const mockUseFeatureFlagToggle = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlagToggle', () => ({
  useFeatureFlagToggle: () => mockUseFeatureFlagToggle(),
}))

jest.mock('@appcues/react-native', () => ({
  AppcuesFrameView: () => null,
  identify: jest.fn(),
  anonymous: jest.fn(),
}))

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    user: null,
  }),
}))

const cases = [
  {
    section: undefined,
    order: ['STARTSMALL', 'VOLUNTEERING', 'PETITIONS', 'EVENTS', 'CHALLENGES', 'DONATIONS'],
  },
  {
    section: 'SPACE',
    order: ['STARTSMALL', 'VOLUNTEERING', 'PETITIONS', 'EVENTS', 'CHALLENGES', 'DONATIONS'],
  },
  {
    section: 'DONATIONS',
    order: ['DONATIONS', 'STARTSMALL', 'VOLUNTEERING', 'PETITIONS', 'EVENTS', 'CHALLENGES'],
  },
  {
    section: 'VOLUNTEERING',
    order: ['VOLUNTEERING', 'STARTSMALL', 'PETITIONS', 'EVENTS', 'CHALLENGES', 'DONATIONS'],
  },
  {
    section: 'CHALLENGES',
    order: ['CHALLENGES', 'STARTSMALL', 'VOLUNTEERING', 'PETITIONS', 'EVENTS', 'DONATIONS'],
  },
]

describe('ActHome Section', () => {
  it.each(cases)('query parameter section=$section gives order: $order', ({ section, order }) => {
    mockUseFeatureFlagToggle.mockReturnValue(false)
    const orderedSect = orderedSections(section)
    expect(orderedSect).toStrictEqual(order)
    mockParameters({ section })

    mockActSection.mockReturnValue(<></>)
    render(<ActHome />)
    const calls = mockActSection.mock.calls
    expect(mockActSection).toHaveBeenCalledTimes(order.length)
    calls.forEach((call, i) => {
      expect(call[0]).toStrictEqual({ type: order[i] })
    })
  })
})
