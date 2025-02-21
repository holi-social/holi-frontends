import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import type Link from 'next/link'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliLink as HoliLinkWeb } from '@holi/core/navigation/components/HoliLink/index.web'
import { useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'
import { Pressable } from 'react-native'

const mockUseWebHistory = useWebHistory as jest.Mock
jest.mock('@holi/core/navigation/hooks/useWebHistory', () => ({
  useWebHistory: jest.fn(),
}))

const LinkMock = (props: Parameters<typeof Link>[0]) => (
  // @ts-ignore
  <Pressable onPress={props.onClick} testID={props['data-testid']} />
)
jest.mock('next/link', () => LinkMock)

describe('HoliLink', () => {
  it('renders child component', () => {
    render(
      <HoliLink label="test" href="/">
        <Text size="md">inner</Text>
      </HoliLink>
    )

    expect(screen.getByText('inner')).toBeDefined()
  })

  it('calls onPress handler', () => {
    const onPress = jest.fn()
    render(<HoliLink label="test" href="/" onPress={onPress} />)

    fireEvent.press(screen.getByTestId('link'))

    expect(onPress).toHaveBeenCalled()
  })

  it('should navigate on press if no onPress is given', () => {
    render(<HoliLink label="test" href="/spaces" />)

    fireEvent.press(screen.getByTestId('link'))

    expect(mockNavigate).toHaveBeenCalledWith('//spaces')
  })

  describe('web', () => {
    const mockPush = jest.fn()
    beforeEach(() => {
      const mockedWebHistory: ReturnType<typeof useWebHistory> = {
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        syncInitialRoute: jest.fn(),
      }
      mockUseWebHistory.mockReturnValue(mockedWebHistory)
    })

    it('should update web history', () => {
      render(<HoliLinkWeb label="test" href="/spaces" />)

      fireEvent.press(screen.getByTestId('link'))

      expect(mockPush).toHaveBeenCalledWith('/spaces')
    })
  })
})
