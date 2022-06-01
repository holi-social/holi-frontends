import Link from 'next/link'
import { ReactElement } from 'react'

import ImportedSvg from '@holi/ui/assets/img/logo/logo.svg'
import Holicon from '@holi/ui/components/holicon'
import SharedImage from '@holi/ui/components/sharedImage'
import { UiLayout } from '@holi/web/layout/UiLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import sassStyles from './ui.module.scss'

const SharedImagePage: NextPageWithLayout = () => {
  return (
    <section>
      <div className={sassStyles.headline}>
        <Link href="/ui">
          <a>
            <Holicon icon="arrow-back" size={50} />
          </a>
        </Link>
        <h1>SharedImage</h1>
      </div>

      <div className={sassStyles.example}>
        <SharedImage
          imageFile={require('@holi/ui/assets/img/logo/Logo_img.png')}
          style={{ width: 30, height: 30 }}
          altText="Holi logo"
        />
        <SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} altText="Holi logo" />
      </div>

      <pre className={sassStyles.code}>{`
<SharedImage imageFile={require('assets/img/some.png')} style={{ width: 30, height: 30 }} altText="Holi logo" />

import ImportedSvg from '@holi/ui/assets/img/some.svg'
<SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} altText="Holi logo" />
      `}</pre>
    </section>
  )
}

SharedImagePage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default SharedImagePage
