import { renderHook, act } from '@testing-library/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

// Properly type the mocked AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

// Cast the mocked functions to the correct types
const mockedGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>
const mockedSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>

// Mock logError
jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

describe('useRandomizedRecos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should interact with AsyncStorage correctly', async () => {
    // Mock AsyncStorage.getItem to return null (first run)
    mockedGetItem.mockResolvedValue(null)

    // Create a mock recommendation
    const mockRecos: LocalizedTypesenseDocument[] = [
      {
        id: '1',
        title: 'Test Engagement',
      } as LocalizedTypesenseDocument,
    ]

    // Render the hook
    renderHook(() => useRandomizedRecos(mockRecos, 5))

    // Wait for async operations to complete
    await act(async () => {
      // No need for an explicit timeout
    })

    // Verify AsyncStorage interactions
    expect(mockedGetItem).toHaveBeenCalled()
    expect(mockedSetItem).toHaveBeenCalled()
  })
})
