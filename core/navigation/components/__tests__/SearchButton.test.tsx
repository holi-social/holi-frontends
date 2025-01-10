import React from 'react'
import { SearchButton } from '@holi/core/navigation/components/header/SearchButton'
import { render, screen, userEvent } from '@testing-library/react-native'
import { TrackingEvent } from '@holi/core/tracking'

describe('SearchButton', () => {
  it('links to search', async () => {
    const user = userEvent.setup()
    render(<SearchButton />)

    await user.press(screen.getByRole('button'))
    expect(mockNavigate).toHaveBeenCalledWith('/search')
  })
  it('tracks clicks', async () => {
    const user = userEvent.setup()
    render(<SearchButton />)

    await user.press(screen.getByRole('button'))
    expect(mockTrack).toHaveBeenCalledWith({
      name: 'searchButtonPressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
    } as TrackingEvent)
  })
})
