import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'

import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { users } from '@holi/ui/components/organisms/__mocks__/users'

describe('HoliUserCardsModalContent', () => {
  it('renders correct snapshot', () => {
    render(<HoliUserCardsModalContent users={users} onDismiss={() => 'test'} />)
    expect(screen).toMatchSnapshot()
  })

  it('has correct number of user cards', () => {
    const { getAllByTestId } = render(<HoliUserCardsModalContent users={users} onDismiss={() => 'test'} />)

    expect(getAllByTestId('user-card').length).toEqual(users.length)
  })

  it('has close button and onDismiss is triggered upon press', async () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliUserCardsModalContent users={users} onDismiss={mockFn} testID="userModal" />)

    fireEvent.press(getByTestId('userModal-close-btn'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
