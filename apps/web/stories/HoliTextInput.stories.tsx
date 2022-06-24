/* eslint-disable import/no-anonymous-default-export */
import React from 'react'

import HoliTextInput from '@holi/ui/components/HoliTextInput'
import { HoliTextInputType } from '@holi/ui/components/HoliTextInput/HoliTextInput.types'

export default {
  title: 'Components/HoliTextInput',
  parameters: {
    docs: {
      description: {
        component: 'HoliTextInput - text input component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => (
  <HoliTextInput
    label={args.label}
    placeholder={args.placeholder}
    helperText={args.helperText}
    isErrored={args.isErrored}
    noLabel={args.noLabel}
    isFullWidth={args.isFullWidth}
    minNumberOfLines={args.minNumberOfLines}
    maxNumberOfLines={args.maxNumberOfLines}
  />
)
Primary.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  isErrored: false,
  noLabel: false,
  isFullWidth: false,
  minNumberOfLines: 1,
  maxNumberOfLines: 3,
}
Primary.argTypes = {
  placeholder: {
    description: 'string',
  },
  isErrored: {
    description: 'boolean',
  },
  onChange: {
    description: 'function - onChange callback',
  },
}
