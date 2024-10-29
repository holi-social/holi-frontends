import { fireEvent, render, screen } from '@testing-library/react-native'
import { ChipAction } from 'holi-bricks/components/chips'
import { Selector } from 'holi-bricks/components/selectors/Selector'
import { SelectorCard } from 'holi-bricks/components/selectors/SelectorCard'
import React from 'react'

describe('Selector', () => {
  it('renders correctly with SelectorCards', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} inputType={'none'} onSelect={mockFn}>
        <SelectorCard title={'card1'} id={'1'} />
        <SelectorCard title={'card2'} id={'2'} />
      </Selector>
    )

    expect(screen.getByText('title')).toBeOnTheScreen()
    expect(screen.getByText('card1')).toBeOnTheScreen()
    expect(screen.getByText('card2')).toBeOnTheScreen()
  })
  it('renders correctly with ChipActions', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} inputType={'none'} onSelect={mockFn}>
        <ChipAction onPress={mockFn} id={'1'}>
          Chip 1
        </ChipAction>
        <ChipAction onPress={mockFn} id={'2'}>
          Chip 2
        </ChipAction>
      </Selector>
    )

    expect(screen.getByText('title')).toBeOnTheScreen()
    expect(screen.getByText('Chip 1')).toBeOnTheScreen()
    expect(screen.getByText('Chip 2')).toBeOnTheScreen()
  })
  it('calls onSelect correctly when clicked', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} inputType={'none'} onSelect={mockFn}>
        <SelectorCard title={'card1'} id={'1'} />
        <SelectorCard title={'card2'} id={'2'} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith('1')
  })
  it('calls childrens onPress correctly when clicked', () => {
    const mockFn = jest.fn()
    const mockFn1 = jest.fn()
    const mockFn2 = jest.fn()
    render(
      <Selector title={'title'} inputType={'none'} onSelect={mockFn}>
        <SelectorCard title={'card1'} id={'1'} onPress={mockFn1} />
        <SelectorCard title={'card2'} id={'2'} onPress={mockFn2} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn1).toHaveBeenCalled()
    expect(mockFn2).not.toHaveBeenCalled()
  })
  it('calls onChange correctly when answerOptions changed', () => {
    const mockFn = jest.fn()
    render(
      <Selector title={'title'} inputType={'none'} onChange={mockFn}>
        <SelectorCard title={'card1'} id={'1'} />
        <SelectorCard title={'card2'} id={'2'} />
      </Selector>
    )
    fireEvent.press(screen.getByText('card1'))
    expect(mockFn).toHaveBeenCalledWith(['1'])

    fireEvent.press(screen.getByText('card2'))
    expect(mockFn).toHaveBeenCalledWith(['1', '2'])
  })
})
