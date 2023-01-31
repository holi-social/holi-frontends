import type { ScreenOptions } from '@react-navigation/native'

declare let mockNavigate: (routeName: string) => void
declare let captureSentryException: (error: Error) => void
declare let mockSetOptions: (options: Partial<ScreenOptions>) => void
declare let mockOpenURL: (url: string) => void
