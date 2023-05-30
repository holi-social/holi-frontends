import type RefreshableWrapper from 'react-native-fresh-refresh'

import { LayoutProps } from '@holi/core/components/DefaultLayout'

type DefaultProps = Omit<LayoutProps, 'refreshControl'>
type RefreshableWrapperProps = Omit<React.ComponentProps<typeof RefreshableWrapper>, 'children'> & {
  loaderTopOffset?: number
}

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshableWrapperProps
}
