import Link from 'next/link'
import { useRouter } from 'next/router'

const Nav = () => {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isComponents = router.pathname === '/components'
  const isFeed = router.pathname === '/feed'
  const isUiLib = router.pathname === '/ui'
  return (
    <nav style={{ flexDirection: 'row' }}>
      {isHome ? (
        <b>Home</b>
      ) : (
        <Link href={'/'}>
          <a>Home</a>
        </Link>
      )}{' '}
      |{' '}
      {isComponents ? (
        <b>Components</b>
      ) : (
        <Link href={'/components'}>
          <a>Components</a>
        </Link>
      )}{' '}
      |{' '}
      {isFeed ? (
        <b>Feed</b>
      ) : (
        <Link href={'/feed'}>
          <a>Feed</a>
        </Link>
      )}{' '}
      |{' '}
      {isUiLib ? (
        <b>UI Lib</b>
      ) : (
        <Link href={'/ui'}>
          <a>UI Lib</a>
        </Link>
      )}
    </nav>
  )
}

export default Nav
