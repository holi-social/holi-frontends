import { NextPage } from 'next'
import Link from 'next/link'
import Holicon from '@holi/ui/components/holicon'

import sassStyles from './ui.module.scss'

const UIOverviewPage: NextPage = () => {
  return (
    <section>
      <h1 className={sassStyles.headline}>UI Pattern Lib</h1>

      <ul className={sassStyles.linkList}>
        <li>
          <Holicon icon="arrowtip-next" size={20} />
          <Link href="/ui/icons">
            <a>Holicons</a>
          </Link>
        </li>
        <li>
          <Holicon icon="arrowtip-next" size={20} />
          <Link href="/ui/sharedImage">
            <a>SharedImage</a>
          </Link>
        </li>
        <li>
          <Holicon icon="arrowtip-next" size={20} />
          <Link href="/ui/button">
            <a>Button</a>
          </Link>
        </li>
        <li>
          <Holicon icon="arrowtip-next" size={20} />
          <Link href="/ui/cardSwiper">
            <a>CardSwiper</a>
          </Link>
        </li>
      </ul>
    </section>
  )
}

export default UIOverviewPage
