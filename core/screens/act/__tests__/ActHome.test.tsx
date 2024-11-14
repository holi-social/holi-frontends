import { render } from '@testing-library/react-native'
import React from 'react'

import ActHome, { orderedSections } from '@holi/core/screens/act/ActHome'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

const mockPosthog = jest.fn()
jest.mock('@holi/core/tracking/PosthogCrossPlatform', () => ({
  usePosthogCrossPlatform: () => mockPosthog(),
}))

jest.mock('@holi/core/navigation/hooks/useParam')

const mockActSection = jest.fn()
jest.mock('@holi/core/screens/act/ActSection', () => ({
  ActSection: (prop: { type: string }) => mockActSection(prop), // Mock ActSection
}))

const cases = [
  { section: undefined, order: ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS'] },
  { section: 'SPACE', order: ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS'] },
  { section: 'DONATIONS', order: ['DONATIONS', 'CHALLENGES', 'VOLUNTEERING'] },
  { section: 'VOLUNTEERING', order: ['VOLUNTEERING', 'CHALLENGES', 'DONATIONS'] },
  { section: 'CHALLENGES', order: ['CHALLENGES', 'VOLUNTEERING', 'DONATIONS'] },
]

describe('ActHome Section', () => {
  it.each(cases)('query parameter section=$section gives order: $order', ({ section, order }) => {
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
