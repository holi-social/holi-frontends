import type { Meta } from '@storybook/react'
import React from 'react'

import HoliLogo from '@holi/ui/components/atoms/HoliLogo'

const meta: Meta<typeof HoliLogo> = {
  component: HoliLogo,

  title: 'Atoms/HoliLogo',
  parameters: {
    docs: {
      description: {
        component: 'Simple theme-aware Holi Logo.',
      },
    },
  },
}

export const Logo = {
  render: () => <HoliLogo />,
}

export default meta
