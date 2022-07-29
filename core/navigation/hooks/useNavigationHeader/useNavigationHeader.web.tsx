import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigationContext = useNavigationContext()

  return {
    setNavigationHeader: (props: HeaderProps) => {
      console.log('########## useNavigationHeader props: ', props.headerRight)
      const title = props.title || ''
      if (title) navigationContext.setHeaderTitle(title)
      if (props.headerRight) navigationContext.setHeaderRight(props.headerRight)
    },
  }
}

export default useNavigationHeader
