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
        <HoliUserAvatar size="large" />
        <HoliUserAvatar />
        <HoliUserAvatar size="small" />
        <HoliUserAvatar size="micro" />
      </div>

      {/* ===== Code to copy section ===== */}
      <pre className={sassStyles.code}>{`
`}</pre>
    </section>
  )
}

ButtonPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default ButtonPage
