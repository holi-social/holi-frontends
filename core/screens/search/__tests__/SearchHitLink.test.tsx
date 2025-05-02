import React from 'react'
import { render, userEvent, screen } from '@testing-library/react-native'
import { SearchHitLink } from '@holi/core/screens/search/SearchHitLink'
import { profileHit, spaceHit, volunteeringHit } from '@holi/core/screens/search/__tests__/testData'

describe('SearchHitLink', () => {
  it('should create correct link for space', async () => {
    const user = userEvent.setup()

    render(<SearchHitLink hit={spaceHit} label="space" />)

    await user.press(screen.getByLabelText('space'))

    expect(mockNavigate).toHaveBeenCalledWith('//spaces/coworking-mitte')
  })

  it('should create correct link for user', async () => {
    const user = userEvent.setup()

    render(<SearchHitLink hit={profileHit} label="user" />)

    await user.press(screen.getByLabelText('user'))

    expect(mockNavigate).toHaveBeenCalledWith('//profile/9035322c-3d67-46ca-a2b8-657be490ec00')
  })

  it('should create correct link for volunteering engagement', async () => {
    const user = userEvent.setup()

    render(<SearchHitLink hit={volunteeringHit} label="volunteering" />)

    await user.press(screen.getByLabelText('volunteering'))

    expect(mockNavigate).toHaveBeenCalledWith('//volunteering/157403')
  })

  it('should create fallback href if link locators are missing', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()
    const hit = {
      ...spaceHit,
      link_locators: {},
    }

    render(<SearchHitLink hit={hit} label="space" onPress={onPress} />)

    await user.press(screen.getByLabelText('space'))

    expect(mockNavigate).toHaveBeenCalledWith('/#')
  })

  it('should call onPress callback', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(<SearchHitLink hit={spaceHit} label="space" onPress={onPress} />)

    await user.press(screen.getByLabelText('space'))

    expect(onPress).toHaveBeenCalled()
  })
})
