import { fireEvent, render, screen, within } from '@testing-library/react-native'
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

  it('renders correctly when opened', () => {
    render(<HoliModalSelect {...defaultProps} />)
    fireEvent.press(screen.getByTestId('btn-holi-modal-select'))
    // items should be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(defaultOptions.length)
    // test snapshot
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('correctly selects an option', async () => {
    render(<ParentComponent />)
    fireEvent.press(screen.getByTestId('btn-holi-modal-select'))

    // select first option
    const firstOption = screen.getAllByTestId('item-holi-modal-select')[0]
    fireEvent.press(firstOption)

    // check firstOption is selected
    expect(within(firstOption).getByTestId('checked-holi-modal-select')).toBeDefined()

    // ensure no other option is selected
    expect(screen.queryAllByTestId('checked-holi-modal-select').length).toBe(1)

    // check render correctly after selection
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('correctly displays selected option title in the button when modal is closed', async () => {
    render(<ParentComponent />)
    const modalSelectButton = screen.getByTestId('btn-holi-modal-select')
    fireEvent.press(modalSelectButton)

    // select first option
    const firstOption = screen.getAllByTestId('item-holi-modal-select')[0]
    fireEvent.press(firstOption)

    // close modal (click on backdrop)
    fireEvent.press(screen.getByTestId('holi-modal-select-backdrop'))

    // check that the first option's title is in the button
    expect(modalSelectButton).toHaveTextContent(defaultOptions[0].title)
  })
})
