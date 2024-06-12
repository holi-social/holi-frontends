import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { SuppressSsrHydrationWarning } from '@holi/core/components/SuppressSsrHydrationWarning'
import { SuppressSsrHydrationWarning as SuppressSsrHydrationWarningWeb } from '@holi/core/components/SuppressSsrHydrationWarning.web'

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: () => ({ userId: 'userId' }),
}))

describe('SuppressSsrHydrationWarning', () => {
  it('should render children unchanged on mobile', () => {
    render(<SuppressSsrHydrationWarning>Test</SuppressSsrHydrationWarning>)

    expect(screen.toJSON()).toMatchInlineSnapshot('"Test"')
  })

  it('should wrap children in span suppressing hydration warnings on web', () => {
    render(<SuppressSsrHydrationWarningWeb>Test</SuppressSsrHydrationWarningWeb>)

    expect(screen.toJSON()).toMatchInlineSnapshot(`
      <span
        suppressHydrationWarning={true}
      >
        Test
      </span>
    `)
  })
})
