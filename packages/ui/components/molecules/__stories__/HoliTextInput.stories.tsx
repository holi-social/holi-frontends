import React from 'react'

import iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

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
  inline: true,
  type: 'text',
}
Primary.argTypes = {
  type: {
    type: 'select',
    options: ['text', 'email', 'number', 'password'],
  },
}

export const WithError = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
WithError.args = {
  validationErrorText: 'Validation Error Text',
}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
NoLabel.args = {}

export const Disabled = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
Disabled.args = {
  disabled: true,
}

export const Multiline = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} multiline {...args} />
)
Multiline.args = {
  noOfVisibleLines: 1,
  maxNoOfVisibleLines: 5,
}

export const MultilineVariant = ({ ...args }) => (
  <HoliTextInput label={'Label'} placeholder={'Placeholder'} helperText={'Helper Text'} multiline {...args} />
)
MultilineVariant.args = {
  noOfVisibleLines: 2,
  maxNoOfVisibleLines: 5,
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
  type: 'password',
}

Password.argTypes = {
  type: {
    type: 'select',
    options: ['password'],
  },
}
