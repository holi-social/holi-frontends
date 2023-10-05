import { User } from '@holi/core/screens/userprofile/types'

let mockChatFeatureToggle: Record<string, boolean | string>
let mockLoggedInUser: User | undefined
let mockLoggedInUserState:
  | {
      isLoggedIn: boolean
      isLoading: boolean
    }
  | undefined
let mockMatrixSessionInStorage: [string, boolean | string | undefined][]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let mockOrySessionInStorage: Record<string, string> | undefined

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    user: mockLoggedInUser,
    ...mockLoggedInUserState,
    refetch: jest.fn(),
  }),
}))

jest.mock('@holi/core/helpers/useFeatureToggle', () => ({
  useFeatureToggle: () => mockChatFeatureToggle,
  FeatureToggleName: {
    CHAT: 'CHAT',
  },
}))

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    multiGet: async () => mockMatrixSessionInStorage,
    multiSet: async () => mockMatrixSessionInStorage,
    multiRemove: async () => null,
  }
})
