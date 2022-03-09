import { NextPage } from 'next'
import CardSwiper from 'shared/components/ui/CardSwiper'

import sassStyles from './ui.module.scss'


const CardSwiperPage: NextPage = () => {
  return (
    <section>
      <div className={sassStyles.headline}>
        <h1>CardSwiper</h1>
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