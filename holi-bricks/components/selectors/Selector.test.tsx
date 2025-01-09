import { fireEvent, render, screen } from '@testing-library/react-native'
import { Selector } from 'holi-bricks/components/selectors/Selector'
import React from 'react'

import { SelectableCard, SelectableChip } from './Selectable'

describe('Selector', () => {
  it('renders correctly with SelectableCards', () => {
    render(
      <Selector title="title">
        <SelectableCard title="card1" id="1" />
        <SelectableCard title="card2" id="2" />
      </Selector>
    )

    expect(screen.getByText('title')).toBeOnTheScreen()
    expect(screen.getByText('card1')).toBeOnTheScreen()
    expect(screen.getByText('card2')).toBeOnTheScreen()
  })
  it('renders correctly with SelectableChips', () => {
    render(
      <Selector title="title">
        <SelectableChip id="1">Chip 1</SelectableChip>
        <SelectableChip id="2">Chip 2</SelectableChip>
      </Selector>
    )

    expect(screen.getByText('title')).toBeOnTheScreen()
    expect(screen.getByText('Chip 1')).toBeOnTheScreen()
    expect(screen.getByText('Chip 2')).toBeOnTheScreen()
  })
  it('calls onSelect correctly when clicked', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} onSelect={mockFn}>
        <SelectableCard title={'card1'} id={'1'} />
        <SelectableCard title={'card2'} id={'2'} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith('1')
    expect(mockFn).not.toHaveBeenCalledWith('2')
  })

  it('calls onChange correctly when answerOptions changed in checkbox mode', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} onChange={mockFn} inputType="checkbox">
        <SelectableCard title={'card1'} id={'1'} />
        <SelectableCard title={'card2'} id={'2'} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith(['1'])

    fireEvent.press(screen.getByText('card2'))
    expect(mockFn).toHaveBeenCalledWith(['1', '2'])

    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith(['2'])
  })

  it('calls onChange correctly when answerOptions changed in radio mode', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} onChange={mockFn} inputType="radio">
        <SelectableCard title={'card1'} id={'1'} />
        <SelectableCard title={'card2'} id={'2'} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith(['1'])

    fireEvent.press(screen.getByText('card2'))
    expect(mockFn).toHaveBeenCalledWith(['2'])

    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith(['1'])
  })

  it('calls childrens onPress correctly when clicked', () => {
    const mockFn = jest.fn()
    const mockFn1 = jest.fn()
    const mockFn2 = jest.fn()
    render(
      <Selector title={'title'} onChange={mockFn} inputType="radio">
        <SelectableCard title={'card1'} id={'1'} onPress={mockFn1} />
        <SelectableCard title={'card2'} id={'2'} onPress={mockFn2} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn1).toHaveBeenCalled()

    fireEvent.press(screen.getByText('card2'))
    expect(mockFn2).toHaveBeenCalled()
  })
})
