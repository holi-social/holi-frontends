import { fireEvent, render, screen } from '@testing-library/react-native'
import React, { useState } from 'react'

import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'

const defaultOptions = [
  {
    id: 'PUBLIC',
    title: 'Public',
    description: 'Just collaborators can contact you regarding this task.',
    selected: false,
  },
  {
    id: 'MEMBERS',
    title: 'Members',
    description: 'This task is publicly visible. Anyone can contact you regarding this task.',
    selected: false,
  },
]
const title = 'test title'
const label = 'test label'
const onChange = () => null
const defaultProps = {
  title,
  label,
  onChange,
  options: defaultOptions,
}

const ParentComponent = () => {
  const [options, setOptions] = useState(defaultOptions)

  const onSelect = (option: HoliModalSelectOption) => {
    setOptions(options.map((currentOption) => ({ ...currentOption, selected: currentOption.id === option.id })))
  }

  return <HoliModalSelect onChange={onSelect} options={options} title="test" label="test" />
}

jest.useRealTimers()

describe('HoliModalSelect', () => {
  it('renders correctly when closed', () => {
    render(<HoliModalSelect {...defaultProps} />)
    // items should not be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(0)
    // test snapshot
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when opened', async () => {
    render(<HoliModalSelect {...defaultProps} />)
    await fireEvent.press(screen.getByTestId('btn-holi-modal-select'))
    // items should be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(defaultOptions.length)
    // test snapshot
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('correctly selects an option', async () => {
    render(<ParentComponent />)
    await fireEvent.press(screen.getByTestId('btn-holi-modal-select'))

    // select first option
    const firstOption = screen.getAllByTestId('item-holi-modal-select')[0]
    await fireEvent.press(firstOption)

    // check the button has the correct value after modal is closed
    await fireEvent.press(screen.getByTestId('btn-holi-modal-select'))
    expect(screen.getByTestId('btn-holi-modal-select')).toHaveTextContent('Public')

    // ensure no other option is selected
    expect(screen.queryAllByTestId('checked-holi-modal-select').length).toBe(1)

    // check render correctly after selection
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when opened in dense variant', async () => {
    render(<HoliModalSelect {...defaultProps} variant="dense" />)
    await fireEvent.press(screen.getByTestId('btn-holi-modal-select'))
    // items should be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(defaultOptions.length)
    // test snapshot
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
