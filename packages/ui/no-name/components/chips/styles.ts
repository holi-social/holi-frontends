import { Platform, ViewStyle } from 'react-native'

import Spacing from '@holi/ui/foundations/Spacing'

export const pill = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing['4xs'],
  maxWidth: '100%',
  overflow: 'hidden',
  ...Platform.select({
    web: {
      display: 'inline-flex' as ViewStyle['display'],
    },
  }),
  borderRadius: 50,
} as const
