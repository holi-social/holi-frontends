import React, { useState } from 'react'

import iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
import HoliAutocomplete, { Suggestion } from '@holi/ui/components/molecules/HoliAutocomplete'

export default {
  title: 'Molecules/HoliAutocomplete',
  parameters: {
    docs: {
      description: {
        component: 'HoliAutocomplete - text input component with async suggestions.',
      },
    },
  },
}

const allSuggestions = [
  {
    id: '1',
    label: 'Hamburg, Germany',
  },
  {
    id: '2',
    label: 'Berlin, Germany',
  },
  {
    id: '3',
    label: 'Munich, Germany',
  },
]

export const Primary = ({ ...args }) => {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [helperText, setHelperText] = useState('')
  const onChange = (input: string) => {
    setLoading(true)
    setTimeout(() => {
      setSuggestions(input ? allSuggestions.slice(0, input.length % (allSuggestions.length + 1)) : [])
      setHelperText(input && !suggestions.length ? 'No suggestions found' : '')
      setLoading(false)
    }, 1000)
  }

  return (
    <HoliAutocomplete
      accessibilityLabel={args.accessibilityLabel}
      debounce={args.debounce}
      id={args.id}
      {...args}
      onChange={onChange}
      suggestions={suggestions}
      loading={loading}
      helperText={helperText}
    />
  )
}

Primary.args = {
  inputLabel: 'Label',
  accessibilityLabel: 'accessibility label',
  placeholder: 'Start typing...',
  debounce: 500,
  trailingIcon: 'search',
  id: 'autocomplete-primary',
}
const argTypes = {
  inputLabel: { description: 'Label', required: true, control: { type: 'text' } },
  accessibilityLabel: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  placeholder: { description: 'Placeholder', control: { type: 'text' } },
  debounce: { description: 'Delay after typing before search starts', control: { type: 'number' } },
  trailingIcon: {
    type: 'select',
    options: iconSetRegular.icons.map((icon) => icon?.properties?.name),
  },
  suggestions: { description: 'Suggestions', control: false },
  loading: { description: 'Flag if suggestions are being loaded', control: { type: 'boolean' } },
  id: { description: 'Unique id for accessibility control', control: false },
}
Primary.argTypes = argTypes

export const WithError = ({ ...args }) => (
  <HoliAutocomplete
    accessibilityLabel={args.accessibilityLabel}
    suggestions={args.suggestions}
    debounce={args.debounce}
    id={args.id}
    {...args}
  />
)

WithError.args = {
  inputLabel: 'Label',
  accessibilityLabel: 'accessibility label',
  placeholder: 'Start typing...',
  helperText: 'No suggestions found',
  id: 'autocomplete-error',
  debounce: 500,
  trailingIcon: 'search',
  validationErrorText: 'Error retrieving suggestions',
  suggestions: [],
  loading: false,
}
WithError.argTypes = argTypes
