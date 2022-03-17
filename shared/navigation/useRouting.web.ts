import { useRouter } from 'next/router'

const useRouting = () => {
  const router = useRouter()
  return {
    navigate: (routeName: string) => router.push(routeName),
    query: router.query,
  }
}

export default useRouting
