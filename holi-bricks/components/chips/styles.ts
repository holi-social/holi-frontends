import { Spacing } from 'holi-bricks/foundations'
import { Platform, type ViewStyle } from 'react-native'

export const pill = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: Spacing['4xs'],
  maxWidth: '100%',
  overflow: 'hidden',
  ...(Platform.select({
    web: {
      display: 'inline-flex' as ViewStyle['display'],
    },
    // Cast to any otherwise unistyles complains that this does not exist
    // in RN extended stylesheet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any),
  borderRadius: 50,
} as const
