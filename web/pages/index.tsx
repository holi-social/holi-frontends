import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Button from 'shared/components/ui/Button'
import SharedImage from "shared/components/ui/sharedImage"
import { Paragraph } from 'shared/components/ui/Text'

import { useTheme } from 'shared/styles/theme'
import styles from '../styles/home.module.scss'

import ImportedSvg from 'shared/assets/img/logo/logo.svg'
import ImportedPng from 'shared/assets/img/logo/Logo_img.png'



const Home: NextPage = () => {
  const router = useRouter()
  const { toggleDarkMode } = useTheme()
  return (
    <>
      <h1>Home</h1>

      <Paragraph>this is a paragraph with local styles</Paragraph>

      <div className={styles.border}>
        <Button onPress={() => router.push('/components')}>Components</Button>
        <Button style={{ marginLeft: 10 }} onPress={() => router.push('/users')}>
          <SharedImage imageFile={ImportedSvg} style={{ width: 50, height: 50 }} />
          <span>Users</span>
        </Button>
        <Button style={{ marginLeft: 10 }} onPress={() => router.push('/feed')}>Feed</Button>
        <Button style={{ marginLeft: 10 }} onPress={toggleDarkMode}>Toggle DarkMode</Button>
      </div>

      <div>
        <SharedImage imageFile={require('shared/assets/img/logo/Logo_img.png')} style={{ width: 50, height: 50 }} />
        <SharedImage imageFile={ImportedSvg} style={{ width: 50, height: 50 }} />
        <Image src={ImportedPng} alt="sdfsdf" width="50" height="50" />
      </div>
    </>
  )
}

export default Home
