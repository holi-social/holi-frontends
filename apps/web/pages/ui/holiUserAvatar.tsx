import Link from 'next/link'
import { ReactElement } from 'react'

import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'
import Holicon from '@holi/ui/components/holicon'
import { UiLayout } from '@holi/web/layout/UiLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import sassStyles from './ui.module.scss'

const ButtonPage: NextPageWithLayout = () => {
  return (
    <section>
      {/* ===== Header section ===== */}
      <div className={sassStyles.headline}>
        <Link href="/ui">
          <a>
            <Holicon icon="arrow-back" size={50} />
          </a>
        </Link>
        <h1>HoliUserAvatar</h1>
      </div>

      {/* ===== Demo section ===== */}
      <div className={sassStyles.example}>
        <HoliUserAvatar
          userName="Holi Shit"
          imageSrc="https://loremflickr.com/cache/resized/65535_51813229831_15e7ac9498_s_50_50_nofilter.jpg"
          size="extralarge"
        />
        <HoliUserAvatar
          userName="some Name"
          imageSrc="https://loremflickr.com/cache/resized/65535_51813229831_15e7ac9498_s_50_50_nofilter.jpg"
          size="large"
        />
        <HoliUserAvatar
          userName="Karl Heinz"
          imageSrc="https://loremflickr.com/cache/resized/65535_51813229831_15e7ac9498_s_50_50_nofilter.jpg"
        />
        <HoliUserAvatar
          userName="Uschi Meyer"
          imageSrc="https://loremflickr.com/cache/resized/65535_51813229831_15e7ac9498_s_50_50_nofilter.jpg"
          size="small"
        />
        <HoliUserAvatar
          userName="Manni"
          imageSrc="https://loremflickr.com/cache/resized/65535_51813229831_15e7ac9498_s_50_50_nofilter.jpg"
          size="micro"
        />
      </div>

      {/* ===== Code to copy section ===== */}
      <pre className={sassStyles.code}>{`
`}</pre>
    </section>
  )
}

ButtonPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default ButtonPage
