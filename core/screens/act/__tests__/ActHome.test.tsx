import { render } from '@testing-library/react-native'
import React from 'react'

import ActHome, { orderedSections } from '@holi/core/screens/act/ActHome'

const mockPosthog = jest.fn()
jest.mock('@holi/core/tracking/PosthogCrossPlatform', () => ({
  usePosthogCrossPlatform: () => mockPosthog(),
}))

const mockUseFirstVisitContentSelection = jest.fn()
jest.mock('@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection', () => ({
  useFirstVisitContentSelection: () => mockUseFirstVisitContentSelection(),
}))

const mockActSection = jest.fn()
jest.mock('@holi/core/screens/act/ActSection', () => ({
  ActSection: (prop: { type: string }) => mockActSection(prop), // Mock ActSection
}))

const cases = [
  { selection: null, order: ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS'] },
  { selection: 'SPACE', order: ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS'] },
  { selection: 'DONATIONS', order: ['DONATIONS', 'CHALLENGES', 'VOLUNTEERING'] },
  { selection: 'VOLUNTEERING', order: ['VOLUNTEERING', 'CHALLENGES', 'DONATIONS'] },
  { selection: 'CHALLENGES', order: ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS'] },
]

describe('ActHome Section', () => {
  it.each(cases)('selection: $selection gives order: $order', ({ selection, order }) => {
    const orderedSect = orderedSections(selection)
    expect(orderedSect).toStrictEqual(order)

    mockActSection.mockReturnValue(<></>)
    mockUseFirstVisitContentSelection.mockReturnValue({ isLoading: false, selectedContentType: selection })
    render(<ActHome />)
    expect(mockUseFirstVisitContentSelection).toHaveBeenCalled()
    const calls = mockActSection.mock.calls
    expect(mockActSection).toHaveBeenCalledTimes(order.length)
    calls.forEach(function (call, i) {
      expect(call[0]).toStrictEqual({ type: order[i] })
    })
  })
})
