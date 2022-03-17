import { useRouter } from 'next/router'

const useRouting = <T extends Record<string, string>>() => {
  const router = useRouter()
  return {
    navigate: (routeName: string) => router.push(routeName),
    query: router.query as T,
  }
}

export default useRouting
