import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Holicon from '@holi/ui/components/holicon'
import CardSwiper from '@holi/ui/components/CardSwiper'
import ReanimatedExample from '@holi/ui/components/ReanimatedExample'

import sassStyles from './ui.module.scss'

// @ts-ignore
const CardSwiperPage: NextPage = () => {
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

export default CardSwiperPage
