import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { users } from '@holi/ui/components/organisms/__mocks__/users'

describe('HoliUserCardsModalContent', () => {
  it('renders correct snapshot', () => {
    const tree = renderer.create(<HoliUserCardsModalContent users={users} onDismiss={() => 'test'} />).toJSON()
    expect(tree).toMatchSnapshot()
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
