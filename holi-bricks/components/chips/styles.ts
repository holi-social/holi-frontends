import { Spacing } from 'holi-bricks/foundations'
import { Platform, type ViewStyle } from 'react-native'

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
