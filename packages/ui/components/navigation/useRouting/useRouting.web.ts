import { useRouter } from 'next/router'

import { useNavigationContext } from '@holi/ui/components/navigation/context'

import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const router = useRouter()
  const navigationContext = useNavigationContext()

  return {
    navigate: (routeName: string) => router.push(routeName),
    query: router.query as T,
    pathname: router.asPath,
    toggleDrawer: navigationContext.toggleDrawerIsOpen,
  }
}

export default useRouting
