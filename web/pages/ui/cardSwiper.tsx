import { NextPage } from 'next'
// import CardSwiper from 'shared/components/ui/CardSwiper'

import sassStyles from './ui.module.scss'



const CardSwiperComponent: React.VoidFunctionComponent = () => {

  if(!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: FrameRequestCallback) => (0)
  }

  if (typeof window !== 'undefined' && window.requestAnimationFrame) return <CardSwiper />
  return <div></div>
}

const CardSwiperPage: NextPage = () => {

  return (
    <section>
      <div className={sassStyles.headline}>
        <h1>CardSwiper</h1>
      </div>


      <div className={sassStyles.example}>
        {/* <CardSwiperComponent /> */}
      </div>

      <pre className={sassStyles.code}>{`
...
      `}</pre>
    </section>
  )
}

export default CardSwiperPage