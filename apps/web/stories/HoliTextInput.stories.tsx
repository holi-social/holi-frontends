/* eslint-disable import/no-anonymous-default-export */
import React from 'react'

import HoliTextInput from '@holi/ui/components/HoliTextInput'

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
    value={args.value}
    label={args.label}
    placeholder={args.placeholder}
    helperText={args.helperText}
    isErrored={args.isErrored}
    noLabel={args.noLabel}
    noOfLines={args.noOfLines}
    maxNoOfLines={args.maxNumberOfLines}
    isDisabled={args.isDisabled}
    isInline={args.isInline}
  />
)
Primary.args = {
  value: '',
  label: 'Label',
  noLabel: false,
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  noOfLines: 1,
  maxNoOfLines: 3,
  isDisabled: false,
  isErrored: false,
  isInline: true,
}
Primary.argTypes = {}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput
    value={args.value}
    label={'Label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    noLabel={true}
  />
)
NoLabel.args = {}

export const Errored = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} isErrored={true} />
)
Errored.args = {}

export const Disabled = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} isDisabled={true} />
)
Disabled.args = {}

export const Multiline = ({ ...args }) => (
  <HoliTextInput
    value={args.value}
    label={'Label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    minNumberOfLines={3}
    maxNumberOfLines={args.maxNumberOfLines}
  />
)
Multiline.args = {
  value: '',
  maxNumberOfLines: 5,
}
