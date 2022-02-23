import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav() {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isComponents = router.pathname === '/components'
  const isUsers = router.pathname === '/users'
  const isFeed = router.pathname === '/feed'
  return (
    <>
      {isHome ? <b>Home</b> : <Link href={'/'}><a>Home</a></Link>}{" "}|{" "}
      {isComponents ? <b>Components</b> : <Link href={'/components'}><a>Components</a></Link>}{" "}|{" "}
      {isUsers ? <b>Users</b> : <Link href={'/users'}><a>Users</a></Link>}{" "}|{" "}
      {isFeed ? <b>Feed</b> : <Link href={'/feed'}><a>Feed</a></Link>}
    </>
  );
}
