import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Button from 'shared/components/button'
import SharedImage from "shared/components/sharedImage"

import styles from '../styles/home.module.scss'

import SvgLogo from 'shared/assets/img/logo/logo.svg'
import PngLogo from 'shared/assets/img/logo/Logo_img.png'


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

      <div>
        <SharedImage imageFile={PngLogo.src} style={{ width: 50, height: 50 }} />
        <SharedImage imageFile={SvgLogo.src} isSvg={true} style={{ width: 50, height: 50 }} />
        <Image src={PngLogo} alt="sdfsdf" width="50" height="50" />
      </div>
    </>
  )
}

export default Home
