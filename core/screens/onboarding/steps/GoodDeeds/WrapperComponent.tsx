import type React from 'react'
import { Platform } from 'react-native'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

const isWeb = Platform.OS === 'web'

export const WrapperComponent = ({ children }: React.PropsWithChildren) =>
  isWeb ? <HoliContainer flex={1}>{children}</HoliContainer> : children
