import { useRouter } from 'next/router'

export const setPathname = () => {}

export const usePathname = () => {
  const { asPath: pathname } = useRouter()
  return pathname
}
