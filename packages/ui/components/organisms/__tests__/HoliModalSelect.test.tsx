import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React, { useState } from 'react'

import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalSelect, {
  HoliModalSelectOption,
  HoliModalSelectVariant,
} from '@holi/ui/components/organisms/HoliModalSelect'

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

const ParentComponent = (props: { variant?: HoliModalSelectVariant }) => {
  const [options, setOptions] = useState(defaultOptions)
  const { show, hide, visible } = useModalState()

  const onSelect = (option: HoliModalSelectOption) => {
    setOptions(options.map((currentOption) => ({ ...currentOption, selected: currentOption.id === option.id })))
  }

  return (
    <HoliModalSelect
      show={show}
      hide={hide}
      visible={visible}
      onChange={onSelect}
      options={options}
      title="test"
      label="test"
      variant={props?.variant}
    />
  )
}

describe('HoliModalSelect', () => {
  it('renders correctly when closed', () => {
    render(<ParentComponent />)
    // items should not be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(0)
  })

  it('renders correctly when opened', () => {
    render(<ParentComponent />)
    fireEvent.press(screen.getByTestId('btn-holi-modal-select'))
    // items should be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(defaultOptions.length)
  })

  it('correctly selects an option', async () => {
    render(<ParentComponent />)
    fireEvent.press(screen.getByTestId('btn-holi-modal-select'))

    // select first option
    const firstOption = screen.getAllByTestId('item-holi-modal-select')[0]
    fireEvent.press(firstOption)

    // check the button has the correct value after modal is closed
    fireEvent.press(screen.getByTestId('btn-holi-modal-select'))

    await waitFor(() => expect(screen.getByTestId('btn-holi-modal-select')).toHaveTextContent('Public'))

    // ensure no other option is selected
    expect(screen.queryAllByTestId('checked-holi-modal-select').length).toBe(1)
  })

  it('renders correctly when opened in dense variant', () => {
    render(<ParentComponent variant="dense" />)
    fireEvent.press(screen.getByTestId('btn-holi-modal-select'))
    // items should be rendered
    expect(screen.queryAllByTestId('item-holi-modal-select')).toHaveLength(defaultOptions.length)
    // test snapshot
  })
})
