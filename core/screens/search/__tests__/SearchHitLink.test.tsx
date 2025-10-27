import React from 'react'
import { renderRouter, fireEvent, screen } from 'expo-router/testing-library'
import { SearchHitLink } from '@holi/core/screens/search/SearchHitLink'
import { profileHit, spaceHit, volunteeringHit } from '@holi/core/screens/search/__tests__/testData'
import { Text } from 'react-native'

describe('SearchHitLink', () => {
  it('should create correct link for space', () => {
    const context = renderRouter({
      index: () => <SearchHitLink hit={spaceHit} label="space" />,
      'spaces/[spaceSlug]': () => <Text>Space</Text>,
    })

    fireEvent.press(screen.getByLabelText('space'))

    expect(context).toHavePathname('/spaces/coworking-mitte')
  })

  it('should create correct link for user', () => {
    const context = renderRouter({
      index: () => <SearchHitLink hit={profileHit} label="user" />,
      'profile/[id]': () => <Text>Profile</Text>,
    })

    fireEvent.press(screen.getByLabelText('user'))

    expect(context).toHavePathname('/profile/9035322c-3d67-46ca-a2b8-657be490ec00')
  })

  it('should create correct link for volunteering engagement', () => {
    const context = renderRouter({
      index: () => <SearchHitLink hit={volunteeringHit} label="volunteering" />,
      'volunteering/[id]': () => <Text>Volunteering</Text>,
    })

    fireEvent.press(screen.getByLabelText('volunteering'))

    expect(context).toHavePathname('/volunteering/157403')
  })

  it('should create fallback href if link locators are missing', () => {
    const onPress = jest.fn()
    const hit = {
      ...spaceHit,
      link_locators: {},
    }

    renderRouter({
      index: () => <SearchHitLink hit={hit} label="space" onPress={onPress} />,
    })

    fireEvent.press(screen.getByLabelText('space'))

    // When link locators are missing, it should still call onPress but not navigate
    expect(onPress).toHaveBeenCalled()
  })

  it('should call onPress callback', () => {
    const onPress = jest.fn()

    renderRouter({
      index: () => <SearchHitLink hit={spaceHit} label="space" onPress={onPress} />,
      'spaces/[spaceSlug]': () => <Text>Space</Text>,
    })

    fireEvent.press(screen.getByLabelText('space'))

    expect(onPress).toHaveBeenCalled()
  })
})
