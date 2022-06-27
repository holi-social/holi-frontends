import { useEffect } from 'react'

import { useNavigationContext } from '@holi/core/navigation/context'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigationContext = useNavigationContext()

  let title: string | undefined

  useEffect(() => {
    if (title) navigationContext.setHeaderTitle(title)
  }, [])

  return {
    setNavigationHeader: (props: HeaderProps) => {
      title = props.title
    },
  }
}

export default useNavigationHeader
