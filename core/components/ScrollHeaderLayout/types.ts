import { LayoutProps } from '@holi/core/components/DefaultLayout/types'

type DefaultProps = Omit<LayoutProps, 'refreshControl'>
interface RefreshableWrapperProps {
  isLoading: boolean
  onRefresh: () => void
  loaderTopOffset?: number
  refreshHeight?: number
}

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshableWrapperProps
}
