import { SafeAreaProvider as OriginalSafeAreaProvider, SafeAreaProviderProps } from 'react-native-safe-area-context'

// Initial metrics required for SSR
// taken from https://github.com/th3rdwave/react-native-safe-area-context/issues/132
export const SafeAreaProvider = (props: SafeAreaProviderProps) =>
  OriginalSafeAreaProvider({
    ...props,
    initialMetrics: {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    },
  })
