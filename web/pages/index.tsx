import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Button from 'shared/components/button'

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <h1>Home</h1>

      <Button text="Components" onPress={() => router.push('/components')}/>
      <Button text="Users" onPress={() => router.push('/users')}/>
      <Button text="Feed" onPress={() => router.push('/feed')}/>
    </>
  )
}

export default Home
