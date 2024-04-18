import { render, screen } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCard, { HoliCardProps } from '@holi/ui/components/molecules/HoliCard'
import { colors } from '@holi/ui/styles/globalVars'

const props: HoliCardProps = {
  imageUrl: 'https://login.freiwilligenarbeit.de/api/v1/content_delivery/images/4620/volunteering-michigan-teaser.jpg',
  imageLabel: 'volunteering',
  imageWidth: 1200,
  testID: 'holiCard',
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
    render(<HoliCard {...props} />)
    const image = screen.getByTestId(`${props.testID}-cardImage`)
    expect(image).toBeTruthy()
    expect(image).toHaveStyle({
      aspectRatio: 1.5,
    })
  })

  it('renders the image with a 1/ 1 aspect ratio', () => {
    render(<HoliCard imageAspectRatio={1} {...props} />)
    expect(screen.getByTestId(`${props.testID}-cardImage`)).toHaveStyle({
      aspectRatio: 1,
    })
  })

  it('renders the card without a border', () => {
    render(<HoliCard {...props} />)

    expect(screen.getByTestId(`${props.testID}`)).not.toHaveStyle({
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.gray200,
    })
  })

  it('renders the card with a border', () => {
    render(<HoliCard hasBorder={true} {...props} />)

    expect(screen.getByTestId(`${props.testID}`)).toHaveStyle({
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.gray200,
    })
  })
})
