import { PartnerListInfoRow } from '@holi-apps/volunteering/components/PartnerListInfoRow'
import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

describe('PartnerInfoListRow', () => {
  it('should render correct text', () => {
    render(<PartnerListInfoRow rowText={'expected text'} linkLabel={'link label'} partners={{}} />)

    expect(screen.getByText('expected text')).toBeOnTheScreen()
  })

  it('should call onPress callback on row press', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<PartnerListInfoRow rowText={'expected text'} linkLabel={'link label'} partners={{}} onPress={onPress} />)

    await user.press(screen.getByLabelText('link label'))

    expect(onPress).toHaveBeenCalled()
  })
})
