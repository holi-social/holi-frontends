import React, { useState } from 'react'

import { Discord } from '@holi/icons/src/generated'
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

export const Primary = ({ ...args }) => <HoliTextInput aria-label={args['aria-label']} {...args} />
Primary.args = {
  inputLabel: 'Label',
  'aria-label': 'accessibility label',
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  maxNoOfCharacters: 50,
  inline: true,
  type: 'text',
  isRequired: true,
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
    aria-label={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
WithError.args = {
  validationErrorText: 'Validation Error Text',
}

export const NoLabel = ({ ...args }) => (
  <HoliTextInput aria-label={'accessibility label'} placeholder={'Placeholder'} helperText={'Helper Text'} {...args} />
)
NoLabel.args = {}

export const Disabled = ({ ...args }) => (
  <HoliTextInput
    inputLabel={'Label'}
    aria-label={'accessibility label'}
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
    inputLabel={'Label'}
    aria-label={'accessibility label'}
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
    inputLabel={'Label'}
    aria-label={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    {...args}
  />
)
MultilineVariant.args = {
  noOfVisibleLines: 2,
  maxNoOfVisibleLines: 5,
}

export const WithTrailingIcon = ({ ...args }) => (
  <HoliTextInput
    inputLabel={'Label'}
    aria-label={'accessibility label'}
    placeholder={'Placeholder'}
    helperText={'Helper Text'}
    trailingIcon={Discord}
    {...args}
  />
)
WithTrailingIcon.args = {}

export const Password = ({ ...args }) => (
  <HoliTextInput
    inputLabel={'Label'}
    aria-label={'accessibility label'}
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

export const WithCharacterCount = ({ ...args }) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <HoliTextInput
      inputLabel={'Label'}
      aria-label={'accessibility label'}
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

WithCharacterCount.argTypes = {
  showCharacterCount: { description: 'Charactor count', control: { type: 'boolean' } },
  maxNoOfCharacters: { description: 'Max number of charactors', type: 'number', control: { type: 'number' } },
}

WithCharacterCount.args = {
  showCharacterCount: true,
  maxNoOfCharacters: 10,
}
