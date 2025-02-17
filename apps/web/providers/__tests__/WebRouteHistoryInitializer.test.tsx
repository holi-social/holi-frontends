import React from 'react'
import { useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'
import { WebRouteHistoryInitializer } from '@holi/web/providers/WebRouteHistoryInitializer'
import { render } from '@testing-library/react-native'
import { useRouter } from 'next/router'

const mockUseWebHistory = useWebHistory as jest.Mock
jest.mock('@holi/core/navigation/hooks/useWebHistory', () => ({
  useWebHistory: jest.fn(),
}))
const mockUseRouter = useRouter as jest.Mock
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('WebRouteHistoryInitializer', () => {
  it('should call syncInitialRoute callback', () => {
    const mockSyncInitialRoute = jest.fn()
    const mockedWebHistory: ReturnType<typeof useWebHistory> = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      syncInitialRoute: mockSyncInitialRoute,
    }
    mockUseWebHistory.mockReturnValue(mockedWebHistory)
    const mockedRouter: Partial<ReturnType<typeof useRouter>> = {
      asPath: '/act',
    }
    mockUseRouter.mockReturnValue(mockedRouter)

    render(<WebRouteHistoryInitializer />)

    expect(mockSyncInitialRoute).toHaveBeenCalledWith('/act')
  })
})
