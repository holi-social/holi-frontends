import {useState, useEffect} from 'react'
import { NextPage } from 'next'
import CardSwiper from 'shared/components/ui/CardSwiper'

import sassStyles from './ui.module.scss'


// @ts-ignore
const CardSwiperPage: NextPage = () => {

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
      setMounted(true)
  }, [])

  return mounted && (
    <section>
      <div className={sassStyles.headline}>
        <h1>CardSwiper cc</h1>
      </div>


      <div className={sassStyles.example}>
          <CardSwiper />
      </div>

      <pre className={sassStyles.code}>{`
...
      `}</pre>
    </section>
  )
}

export default CardSwiperPage
