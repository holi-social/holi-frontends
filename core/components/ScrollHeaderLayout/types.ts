import { ComponentProps } from 'react'
import type RefreshableWrapper from 'react-native-fresh-refresh'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'

type DefaultProps = Omit<LayoutProps, 'refreshControl'>
type RefreshableWrapperProps = Omit<ComponentProps<typeof RefreshableWrapper>, 'children'> & {
  loaderTopOffset?: number
}

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshableWrapperProps
}
