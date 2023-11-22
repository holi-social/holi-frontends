import { CSSProperties, ReactNode } from 'react'
import { RefreshControlProps } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'

type DefaultProps<T extends LayoutProps> = Omit<T, 'refreshControl'>

export type RefreshableScrollHeaderLayoutProps<T extends LayoutProps> = DefaultProps<T> & {
  refreshableProps: RefreshControlProps
  headerOverlap?: boolean
  webWrapperStyle?: CSSProperties
  ScrollViewComponent?: (props: T) => ReactNode
}
