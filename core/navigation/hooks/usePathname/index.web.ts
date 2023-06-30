import { useRouter } from 'next/router'

export const setPathname = () => {
  null
}
export const usePathname = () => {
  const { asPath: pathname } = useRouter()
  return pathname
}
