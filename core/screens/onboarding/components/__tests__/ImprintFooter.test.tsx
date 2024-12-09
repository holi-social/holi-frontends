import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'

import { ImprintFooter } from '@holi/core/screens/onboarding/components/ImprintFooter'

describe('ImprintFooter', () => {
  it('should open modal for imprint', async () => {
    const showDocModal = jest.fn()
    const user = userEvent.setup()

    render(<ImprintFooter legalDocPath="" showDocModal={showDocModal} />)

    await user.press(screen.getByRole('link'))

    expect(showDocModal).toHaveBeenCalledWith('imprint')
  })
})
