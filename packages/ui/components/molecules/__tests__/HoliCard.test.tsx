import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard, { HoliCardProps } from '@holi/ui/components/molecules/HoliCard'

const mockFn = jest.fn()

const props: HoliCardProps = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  testID: 'holiCard',
  style: { width: 300, height: 600 },
  onCardPress: mockFn,
}

describe('HoliCard', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <HoliCard {...props}>
          <HoliText>Holi card component</HoliText>
        </HoliCard>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the image', () => {
    const { getByTestId } = render(<HoliCard {...props} />)
    expect(getByTestId(`${props.testID}-cardImage`)).toBeTruthy
  })

  it('calls onCardPress prop when click on card', async () => {
    const { getByTestId } = render(<HoliCard {...props} />)
    await fireEvent.press(getByTestId('holiCard'))
    expect(mockFn).toBeCalledTimes(1)
  })
})
