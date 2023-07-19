import type RefreshableWrapper from 'react-native-fresh-refresh'

import { DefaultLayoutProps } from '@holi/core/components/DefaultLayout'

type DefaultProps = Omit<DefaultLayoutProps, 'refreshControl'>
type RefreshableWrapperProps = Omit<React.ComponentProps<typeof RefreshableWrapper>, 'children'> & {
  loaderTopOffset?: number
}

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshableWrapperProps
}
