import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { VolunteeringArrayFilterSelection } from '@holi-apps/volunteering/components/VolunteeringArrayFilterSelection'
import { useVolunteeringFilterOptions } from '@holi-apps/volunteering/hooks/useVolunteeringFilterOptions'

const mockUseVolunteeringFilterOptions = jest.mocked(useVolunteeringFilterOptions)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringFilterOptions', () => ({
  useVolunteeringFilterOptions: jest.fn(),
}))

const createOptions = (length: number) =>
  Array.from({ length }, (_, index) => ({
    term: `option-${index}`,
    label: `Option ${index}`,
  }))

const selectedOptions = ['option-4', 'option-2']

describe('VolunteeringArrayFilterSelection', () => {
  const assertOptionsInOrder = (expectedOptions: string[]) => {
    const chips = screen.getAllByRole('switch')
    expect(chips).toHaveLength(expectedOptions.length)
    expectedOptions.forEach((option, index) => {
      expect(chips[index]).toHaveTextContent(option)
    })
  }

  beforeEach(() => {
    mockUseVolunteeringFilterOptions.mockReturnValue(createOptions(5))
  })

  it('displays filter options in order', () => {
    render(<VolunteeringArrayFilterSelection filterKey="topics" selected={[]} onSelect={jest.fn()} />)

    assertOptionsInOrder(['Option 0', 'Option 1', 'Option 2', 'Option 3', 'Option 4'])
  })

  it("sorts selected options to the front if it's a long list of options", () => {
    render(
      <VolunteeringArrayFilterSelection
        filterKey="topics"
        selected={selectedOptions}
        onSelect={jest.fn()}
        longListOfOptions={true}
      />
    )

    assertOptionsInOrder(['Option 2', 'Option 4', 'Option 0', 'Option 1', 'Option 3'])
  })

  it('does not sort selected options to the front for short lists', () => {
    render(<VolunteeringArrayFilterSelection filterKey="topics" selected={selectedOptions} onSelect={jest.fn()} />)

    assertOptionsInOrder(['Option 0', 'Option 1', 'Option 2', 'Option 3', 'Option 4'])
  })

  it('allows filtering options of long lists', async () => {
    mockUseVolunteeringFilterOptions.mockReturnValue(createOptions(12))
    const user = userEvent.setup()

    render(
      <VolunteeringArrayFilterSelection
        filterKey="topics"
        selected={[]}
        onSelect={jest.fn()}
        longListOfOptions={true}
      />
    )

    expect(screen.getByRole('searchbox')).toBeOnTheScreen()

    await user.type(screen.getByRole('searchbox'), 'option 1')

    assertOptionsInOrder(['Option 1', 'Option 10', 'Option 11'])
  })

  it('adds unselected option to selection on press', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()

    render(<VolunteeringArrayFilterSelection filterKey="topics" selected={['option-3']} onSelect={onSelect} />)

    await user.press(screen.getByText('Option 2'))

    expect(onSelect).toHaveBeenCalledWith(['option-3', 'option-2'])
  })

  it('removes selected option from selection on press', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()

    render(<VolunteeringArrayFilterSelection filterKey="topics" selected={['option-3']} onSelect={onSelect} />)

    await user.press(screen.getByText('Option 3'))

    expect(onSelect).toHaveBeenCalledWith([])
  })
})
