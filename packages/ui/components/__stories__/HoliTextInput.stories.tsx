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
  maxNoOfCharacters: 50,
  hasValidationErrors: false,
  validationErrorText: 'Validation error Text',
  inline: true,
  keyboardType: 'text',
}
Primary.argTypes = {
  keyboardType: {
    type: 'select',
    // storybook can only show web only options
    options: ['text', 'email', 'number', 'search', 'url', 'tel'],
  },
}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
NoLabel.args = {}

export const Disabled = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
Disabled.args = {
  isDisabled: true,
}

export const Multiline = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} multiline {...args} />
)
Multiline.args = {
  noOfLines: 1,
  maxNoOfLines: 5,
}

export const MultilineVariant = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} multiline {...args} />
)
MultilineVariant.args = {
  noOfLines: 2,
  maxNoOfLines: 5,
}

export const WithTrailingIcon = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
WithTrailingIcon.args = {
  trailingIcon: 'search',
}
WithTrailingIcon.argTypes = {
  trailingIcon: {
    type: 'select',
    options: iconSetRegular.icons.map((icon) => icon?.properties?.name),
  },
}

export const Password = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
Password.args = {
  secureTextEntry: true,
}
