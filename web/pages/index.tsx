import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Button from 'shared/components/button'

import styles from '../styles/home.module.scss'

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <h1>Home</h1>

      <div className={styles.border}>
        <Button text="Components" onPress={() => router.push('/components')}/>
        <Button text="Users" style={{ marginLeft: 10 }} onPress={() => router.push('/users')}/>
        <Button text="Feed" style={{ marginLeft: 10 }} onPress={() => router.push('/feed')}/>
      </div>
    </>
  )
}

export default Home
