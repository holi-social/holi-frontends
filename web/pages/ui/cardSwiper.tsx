import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import CardSwiper from 'shared/components/ui/CardSwiper'
import ReanimatedExample from 'shared/components/ui/ReanimatedExample'

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
