import React, { useState } from 'react'

import iconSetRegular from '@holi/ui/assets/fonts/HoliIcons/filled/selection.json'
import HoliAutocomplete from '@holi/ui/components/molecules/HoliAutocomplete'
import { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

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
    title: 'Hamburg, Germany',
  },
  {
    id: '2',
    title: 'Berlin, Germany',
  },
  {
    id: '3',
    title: 'Munich, Germany',
  },
]

export const Primary = ({ ...args }) => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<HoliSelectOption[]>([])
  const onChange = (input: string) => {
    setLoading(true)
    setValue(input)
    setTimeout(() => {
      setSuggestions(input ? allSuggestions.slice(0, input.length % (allSuggestions.length + 1)) : [])
      setLoading(false)
    }, 1000)
  }

  return (
    <HoliAutocomplete
      accessibilityLabel={args.accessibilityLabel}
      debounce={args.debounce}
      id={args.id}
      {...args}
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      loading={loading}
    />
  )
}

Primary.args = {
  inputLabel: 'Label',
  accessibilityLabel: 'accessibility label',
  placeholder: 'Start typing...',
  noResultsText: 'No suggestions found',
  debounce: 250,
  trailingIcon: 'search',
  id: 'autocomplete-primary',
}
const argTypes = {
  inputLabel: { description: 'Label', required: true, control: { type: 'text' } },
  accessibilityLabel: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  placeholder: { description: 'Placeholder', control: { type: 'text' } },
  noResultsText: { description: 'Text to display when there are no results', control: { type: 'text' } },
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
  noResultsText: 'No suggestions found',
  id: 'autocomplete-error',
  debounce: 250,
  trailingIcon: 'search',
  validationErrorText: 'Error retrieving suggestions',
  suggestions: [],
  loading: false,
}
WithError.argTypes = argTypes
