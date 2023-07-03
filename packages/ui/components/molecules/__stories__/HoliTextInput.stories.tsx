import React, { useState } from 'react'

import { ICONSET_FILLED, ICONSET_REGULAR } from '@holi/ui/assets/img/icons/HoliIcons/Iconset'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export default {
  title: 'Molecules/HoliTextInput',
  parameters: {
    docs: {
      description: {
        component: 'HoliTextInput - text input component.',
      },
    },
  },
}

export const Primary = ({ ...args }) => <HoliTextInput accessibilityLabel={args.accessibilityLabel} {...args} />
Primary.args = {
  inputLabel: 'Label',
  accessibilityLabel: 'accessibility label',
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
  <HoliTextInput
    inputLabel={'Label'}
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
WithError.args = {
  validationErrorText: 'Validation Error Text',
}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
NoLabel.args = {}

export const Disabled = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
Disabled.args = {
  disabled: true,
}

export const Multiline = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
Multiline.args = {
  noOfVisibleLines: 1,
  maxNoOfVisibleLines: 5,
}

export const MultilineVariant = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    multiline
    {...args}
  />
)
MultilineVariant.args = {
  noOfVisibleLines: 2,
  maxNoOfVisibleLines: 5,
}

export const WithTrailingIcon = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
WithTrailingIcon.args = {
  trailingIcon: 'search',
}
WithTrailingIcon.argTypes = {
  trailingIcon: {
    type: 'select',
    options: { ...ICONSET_REGULAR, ...ICONSET_FILLED },
  },
}

export const Password = ({ ...args }) => (
  <HoliTextInput
    label={'Label'}
    accessibilityLabel={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
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

export const WithCharactorCount = ({ ...args }) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <HoliTextInput
      inputLabel={'Label'}
      accessibilityLabel={'accessibility label'}
      placeholder={'Placeholder'}
      helperText={'Helper Text'}
      value={inputValue}
      onChange={(value: string) => {
        setInputValue(value)
      }}
      {...args}
    />
  )
}

WithCharactorCount.argTypes = {
  showCharacterCount: { description: 'Charactor count', control: { type: 'boolean' } },
  maxNoOfCharacters: { description: 'Max number of charactors', type: 'number', control: { type: 'number' } },
}

WithCharactorCount.args = {
  showCharacterCount: true,
  maxNoOfCharacters: 10,
}
