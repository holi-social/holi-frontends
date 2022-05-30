import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ReactElement } from 'react'

import CardSwiper from '@holi/ui/components/CardSwiper'
import ReanimatedExample from '@holi/ui/components/ReanimatedExample'
import Holicon from '@holi/ui/components/holicon'
import { UiLayout } from '@holi/web/layout/UiLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import sassStyles from './ui.module.scss'

// @ts-ignore
const CardSwiperPage: NextPageWithLayout = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    mounted && (
      <section>
        <div className={sassStyles.headline}>
          <Link href="/ui">
            <a>
              <Holicon icon="arrow-back" size={50} />
            </a>
          </Link>
          <h1>CardSwiper</h1>
        </div>

        <div className={sassStyles.example}>
          <CardSwiper />
          <ReanimatedExample />
        </div>

        <pre className={sassStyles.code}>{`
...
      `}</pre>
      </section>
    )
  )
}

CardSwiperPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default CardSwiperPage
