/* eslint-disable import/no-anonymous-default-export */
import React from 'react'

import iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
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
    label={args.label}
    placeholder={args.placeholder}
    helperText={args.helperText}
    validationErrorText={args.validationErrorText}
    hasValidationErrors={args.hasValidationErrors}
    noLabel={args.noLabel}
    noOfLines={args.noOfLines}
    maxNoOfLines={args.maxNoOfLines}
    noOfCharacters={args.noOfCharacters}
    isDisabled={args.isDisabled}
    isInline={args.isInline}
    trailingIcon={args.trailingIcon}
  />
)
Primary.args = {
  label: 'Label',
  noLabel: false,
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  validationErrorText: 'Validation Error Text',
  noOfLines: 1,
  maxNoOfLines: 3,
  noOfCharacters: 50,
  isDisabled: false,
  hasValidationErrors: false,
  isInline: true,
  trailingIcon: null,
}
Primary.argTypes = {
  trailingIcon: {
    type: 'select',
    options: iconSetRegular.icons.map((icon) => icon?.properties?.name),
  },
}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} noLabel={true} />
)
NoLabel.args = {}

export const Errored = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    placeholder={'Placeholder'}
    validationErrorText={'Validation Error Text'}
    hasValidationErrors={true}
    {...args}
  />
)
Errored.args = {}

export const Disabled = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    placeholder={'Placeholder'}
    helperText={'Input disabled'}
    isDisabled={true}
    {...args}
  />
)
Disabled.args = {}

export const Multiline = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
Multiline.args = {
  noOfLines: 2,
  maxNoOfLines: 5,
}
