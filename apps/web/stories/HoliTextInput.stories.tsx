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

export const Primary = ({ ...args }) => <HoliTextInput {...args} />
Primary.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  noOfCharacters: 50,
  hasValidationErrors: false,
  validationErrorText: 'Validation error Text',
  inline: true,
}
Primary.argTypes = {
  trailingIcon: {
    type: 'select',
    options: iconSetRegular.icons.map((icon) => icon?.properties?.name),
  },
}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
NoLabel.args = {
  noLabel: true,
}

export const Disabled = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
Disabled.args = {
  isDisabled: true,
}

export const Multiline = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
Multiline.args = {
  noOfLines: 2,
  maxNoOfLines: 5,
}
