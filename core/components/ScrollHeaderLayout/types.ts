import React, { CSSProperties } from 'react'
import { RefreshControlProps } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'

export type RefreshableScrollHeaderLayoutProps<T extends LayoutProps> = Omit<T, 'refreshControl'> & {
  refreshableProps: RefreshControlProps
  headerOverlap?: boolean
  webWrapperStyle?: CSSProperties
}

export type RefreshableScrollViewProps<T extends LayoutProps> = Omit<
  RefreshableScrollHeaderLayoutProps<T>,
  'refreshableProps' | 'headerOverlap' | 'webWrapperStyle'
> & {
  refreshControl?: React.ReactElement<RefreshControlProps>
  headerOverlap?: boolean
}
