import { NextPage } from 'next'
import Link from 'next/link'
import Holicon from 'shared/components/ui/holicon'
import sassStyles from './ui.module.scss'

const ButtonPage: NextPage = () => {
  return (
    <section>
      <div className={sassStyles.headline}>
        <Link href="/ui"><a><Holicon icon="arrow-back" size={50} /></a></Link>
        <h1>Button</h1>
      </div>

      <pre className={sassStyles.code}>{`
import Button from 'shared/components/ui/button'

<Button text="Users" style={{}} onPress={() => router.push('/users')} />
      `}</pre>

    </section>
  )
}

export default ButtonPage
