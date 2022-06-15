import Link from 'next/link'
import { ReactElement } from 'react'

import Holicon from '@holi/ui/components/holicon'
import { UiLayout } from '@holi/web/layout/UiLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import sassStyles from './ui.module.scss'

const UIOverviewPage: NextPageWithLayout = () => {
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
          <Link href="/ui/cardSwiper">
            <a>CardSwiper</a>
          </Link>
        </li>
      </ul>
    </section>
  )
}

UIOverviewPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default UIOverviewPage
