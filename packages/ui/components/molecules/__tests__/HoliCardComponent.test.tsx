import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCardComponent, { HoliCardComponentProps } from '@holi/ui/components/molecules/HoliCardComponent'

const mockFn = jest.fn()

const props: HoliCardComponentProps = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  testID: 'holiCard',
  style: { width: 300, height: 600 },
  onCardPress: mockFn,
}

describe('HoliCardComponent', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <HoliCardComponent {...props}>
          <HoliText>Holi card component</HoliText>
        </HoliCardComponent>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the image', () => {
    const { getByTestId } = render(<HoliCardComponent {...props} />)
    expect(getByTestId(`${props.testID}-cardImage`)).toBeTruthy
  })

  it('calls onCardPress prop when click on card', () => {
    const { getByTestId } = render(<HoliCardComponent {...props} />)
    fireEvent.press(getByTestId('holiCard'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
