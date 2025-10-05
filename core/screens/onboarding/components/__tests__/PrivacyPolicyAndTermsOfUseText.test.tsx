import React from 'react'
import { renderRouter, screen, userEvent } from 'expo-router/testing-library'
import PrivacyPolicyAndTermsOfUseText from '@holi/core/screens/onboarding/components/PrivacyPolicyAndTermsOfUseText'

describe('PrivacyPolicyAndTermsOfUseText', () => {
  it('should open modal for privacy policy', async () => {
    const showDocModal = jest.fn()
    const user = userEvent.setup()

    renderRouter({
      index: () => <PrivacyPolicyAndTermsOfUseText legalDocPath="" showDocModal={showDocModal} />,
    })

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)

    await user.press(screen.getAllByRole('link')[0])

    expect(showDocModal).toHaveBeenCalledWith('privacyPolicy')
  })

  it('should open modal for terms of use', async () => {
    const showDocModal = jest.fn()
    const user = userEvent.setup()

    renderRouter({
      index: () => <PrivacyPolicyAndTermsOfUseText legalDocPath="" showDocModal={showDocModal} />,
    })

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)

    await user.press(screen.getAllByRole('link')[1])

    expect(showDocModal).toHaveBeenCalledWith('termsOfUse')
  })
})
