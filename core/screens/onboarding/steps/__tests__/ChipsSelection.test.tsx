import React from 'react'
import {
  ChipsSelection,
  type ChipsSelectionProps,
  type UserChipType,
} from '@holi/core/screens/onboarding/steps/ChipsSelection'
import { render, screen, userEvent } from '@testing-library/react-native'
import { act } from '@testing-library/react-native'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'

const mockUseErrorHandling = useErrorHandling as jest.Mock
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const chipTypes: UserChipType[] = ['interests', 'skills']

describe.each(chipTypes)('ChipsSelection for %s', (chipType) => {
  const displayError = jest.fn()

  const renderScreen = (props: Partial<ChipsSelectionProps> = {}) => {
    render(<ChipsSelection chipType={chipType} selectedChipIds={[]} onSelect={jest.fn()} {...props} />)
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseErrorHandling.mockReturnValue({ displayError })
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('should display headline and available terms', async () => {
    const terms = chipType === 'interests' ? ALL_TOPICS : ALL_SKILLS
    const i18nKey = chipType === 'interests' ? 'topic' : 'skill'

    await renderScreen()

    expect(screen.getByText(`user.${chipType}.form.headline`)).toBeOnTheScreen()

    const chips = screen.getAllByRole('switch')
    expect(chips).toHaveLength(terms.length)
    terms.forEach((term) => expect(screen.getByText(`${i18nKey}.${term}`)).toBeOnTheScreen())
  })

  it('should call on select on chip selection', async () => {
    const onSelect = jest.fn()
    const user = userEvent.setup()
    const terms = chipType === 'interests' ? ALL_TOPICS : ALL_SKILLS
    const selectedTerm = terms[3]
    const i18nKey = chipType === 'interests' ? 'topic' : 'skill'

    await renderScreen({ onSelect })

    await user.press(screen.getByText(`${i18nKey}.${selectedTerm}`))

    expect(onSelect).toHaveBeenCalledWith(selectedTerm)
  })
})
