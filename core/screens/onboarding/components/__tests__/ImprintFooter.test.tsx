import React from 'react'
import { renderRouter, screen, userEvent } from 'expo-router/testing-library'

import { ImprintFooter } from '@holi/core/screens/onboarding/components/ImprintFooter'

describe('ImprintFooter', () => {
  it('should open modal for imprint', async () => {
    const showDocModal = jest.fn()
    const user = userEvent.setup()

    renderRouter({
      index: () => <ImprintFooter legalDocPath="" showDocModal={showDocModal} />,
    })

    await user.press(screen.getByRole('link'))

    expect(showDocModal).toHaveBeenCalledWith('imprint')
  })
})
