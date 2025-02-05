import { act, fireEvent, render, screen } from '@testing-library/react-native'
import React, { useState } from 'react'

import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

const initialOptions: HoliSelectOption[] = [
  {
    id: '1',
    title: 'Animal Welfare',
    selected: false,
  },
  {
    id: '2',
    title: 'Children & Youth',
    selected: false,
  },
  {
    id: '3',
    title: 'Climate Protection',
    selected: false,
  },
  {
    id: '4',
    title: 'Corona',
    selected: false,
  },
  {
    id: '5',
    title: 'Culture & History',
    selected: false,
  },
  {
    id: '6',
    title: 'Development Cooperation',
    selected: false,
  },
  {
    id: '7',
    title: 'Digitalization',
    selected: false,
  },
  {
    id: '8',
    title: 'Disaster Protection',
    selected: false,
  },
]

const SingleSelect = ({ ...args }) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>()

  const toggleOptionSelect = (topic: HoliSelectOption) => {
    if (selectedOption === topic.id) {
      setSelectedOption(undefined)
    } else {
      setSelectedOption(topic.id)
    }
  }

  return (
    <HoliSelect
      id="singleselect"
      aria-label="Accessibility label"
      options={initialOptions.map((option) => ({ ...option, selected: option.id === selectedOption }))}
      onChange={toggleOptionSelect}
      {...args}
    />
  )
}

const MultiSelect = ({ ...args }) => {
  const [options, setOptions] = useState<HoliSelectOption[]>(initialOptions)

  const toggleOptionSelection = (topic: HoliSelectOption) => {
    setOptions((options) =>
      options.map((option) => (option.id === topic.id ? { ...option, selected: !option.selected } : option))
    )
  }

  return (
    <HoliSelect
      multiSelect
      id="multiselect"
      inputLabel="Label"
      aria-label="Accessibility label"
      options={options}
      onChange={toggleOptionSelection}
      {...args}
    />
  )
}

// apparently the Flatlist component within the Select is lazy-loading a module,
// in a way to slow for jest, leading to
// "You are trying to `import` a file after the Jest environment has been torn down."

describe('SingleSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  it('renders correctly when closed', () => {
    render(<SingleSelect />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when opened', () => {
    render(<SingleSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('correctly filters options', () => {
    render(<SingleSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    fireEvent(screen.getByTestId('test-input'), 'onChange', { nativeEvent: { text: 'di' } })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly after selection', () => {
    render(<SingleSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    fireEvent.press(screen.getAllByTestId('test-item')[1])
    expect(screen.getByPlaceholderText('Children & Youth')).toBeDefined()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('calls onChange with selection', () => {
    const onChange = jest.fn()
    render(<HoliSelect aria-label="test" id="test" options={initialOptions} testID="test" onChange={onChange} />)

    fireEvent.press(screen.getByTestId('test-toggle-menu'))

    fireEvent.press(screen.getAllByTestId('test-item')[1])
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }))
  })

  it('clears text input', () => {
    render(<SingleSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    const input = screen.getByTestId('input')
    fireEvent(input, 'onChange', { nativeEvent: { text: 'di' } })
    expect(input).toHaveProp('value', 'di')
    fireEvent.press(screen.getByTestId('test-clear-input'))
    expect(input).toHaveProp('value', '')
  })
})

describe('MultiSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })
  it('renders correctly when closed', () => {
    render(<MultiSelect />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when opened', () => {
    render(<MultiSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly after single selection', () => {
    render(<MultiSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    fireEvent.press(screen.getAllByTestId('test-item')[1])
    expect(screen.getByPlaceholderText('Children & Youth')).toBeDefined()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly after multiple selections', () => {
    render(<MultiSelect testID="test" />)
    fireEvent.press(screen.getByTestId('test-toggle-menu'))
    fireEvent.press(screen.getAllByTestId('test-item')[1])
    fireEvent.press(screen.getAllByTestId('test-item')[2])
    expect(screen.getByPlaceholderText('Label · 2')).toBeDefined()
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
