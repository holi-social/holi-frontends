import { NextPage } from 'next'
import Link from 'next/link'
import sassStyles from './ui.module.scss'

const UIOverviewPage: NextPage = () => {
  return (
    <section>
      <h1 className={sassStyles.headline}>UI Pattern Lib</h1>

      <ul>
        <li><Link href="/ui/icons"><a>Holicons</a></Link></li>
        <li><Link href="/ui/sharedImage"><a>SharedImage</a></Link></li>
        <li><Link href="/ui/button"><a>Button</a></Link></li>
      </ul>
    </section>
  )
}

export default UIOverviewPage