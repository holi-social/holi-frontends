import { CSSProperties, ReactNode } from 'react'
import { RefreshControlProps } from 'react-native'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'

type DefaultProps = Omit<LayoutProps, 'refreshControl'>

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshControlProps
  headerOverlap?: boolean
  webWrapperStyle?: CSSProperties
  ScrollViewComponent?: (props: LayoutProps) => ReactNode
}
