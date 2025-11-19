import React from 'react'
import { SearchButton } from '@holi/core/navigation/components/header/SearchButton'
import { renderRouter } from 'expo-router/testing-library'
import { screen, fireEvent } from '@testing-library/react-native'
import type { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'react-native'

describe('SearchButton', () => {
  it('links to search', () => {
    const context = renderRouter({
      index: () => <SearchButton />,
      search: () => <Text>Search</Text>,
    })

    fireEvent.press(screen.getByRole('button'))
    expect(context).toHavePathname('/search')
  })
  it('tracks clicks', () => {
    renderRouter({
      index: () => <SearchButton />,
      search: () => <Text>Search</Text>,
    })

    fireEvent.press(screen.getByRole('button'))
    expect(mockTrack).toHaveBeenCalledWith({
      name: 'searchButtonPressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    } as TrackingEvent)
  })
})
