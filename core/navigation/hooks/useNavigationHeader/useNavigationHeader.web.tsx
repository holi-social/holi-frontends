import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigationContext = useNavigationContext()

  return {
    setNavigationHeader: (props: HeaderProps) => {
      const title = props.title || ''
      if (title) navigationContext.setHeaderTitle(title)
    },
  }
}

export default useNavigationHeader
