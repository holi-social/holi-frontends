import { NextPage } from 'next'
import Link from 'next/link'

import SharedImage from '@holi/shared/components/ui/sharedImage'
import Holicon from '@holi/shared/components/ui/holicon'
import ImportedSvg from '@holi/shared/assets/img/logo/logo.svg'

import sassStyles from './ui.module.scss'

const SharedImagePage: NextPage = () => {
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
          imageFile={require('@holi/shared/assets/img/logo/Logo_img.png')}
          style={{ width: 30, height: 30 }}
        />
        <SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} />
      </div>

      <pre className={sassStyles.code}>{`
<SharedImage imageFile={require('shared/assets/img/some.png')} style={{ width: 30, height: 30 }} />

import ImportedSvg from '@holi/shared/assets/img/some.svg'
<SharedImage imageFile={ImportedSvg} isSvg={true} style={{ width: 50, height: 50 }} />
      `}</pre>
    </section>
  )
}

export default SharedImagePage
