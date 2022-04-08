import { useRouter } from 'next/router'
import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const router = useRouter()

  return {
    navigate: (routeName: string) => router.push(routeName),
    query: router.query as T,
    pathname: router.asPath,
    toggleDrawer: () => alert('YIEHAAAH'), // TODO: setDrawerOpen(!drawerOpen)} !!!
  }
}

export default useRouting
