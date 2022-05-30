import Link from 'next/link'
import { ReactElement } from 'react'

import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import SharedImage from '@holi/ui/components/sharedImage'
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
        <h1>Button</h1>
      </div>

      {/* ===== Demo section ===== */}
      <div className={sassStyles.example}>
        <HoliButton label="nothing to do here" testID="someId" inline disabled>
          Disabled
        </HoliButton>
        <HoliButton
          label="Open dialog"
          onPress={() => alert('##### some alert message')}
          inline
          active
          style={{ marginLeft: 10 }}
        >
          active
        </HoliButton>
        <HoliButton label="Description" inline style={{ marginLeft: 10 }}>
          <span>With Icon</span>
          <Holicon icon="arrowtip-next" size={20} color="red" />
        </HoliButton>
        <HoliButton label="Go to" inline style={{ marginLeft: 10 }}>
          <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
          <span>With Image</span>
        </HoliButton>
        <HoliButton label="Go to">Fullwidth</HoliButton>
      </div>

      {/* ===== Code to copy section ===== */}
      <pre className={sassStyles.code}>{`
import HoliButton from '@holi/ui/components/HoliButton'

<HoliButton label="nothing to do here" testID="someId" inline disabled>
  Disabled
</HoliButton>

<HoliButton label="Description" inline active>
  active
</HoliButton>

<HoliButton label="Description" inline>
  <span>With Icon</span>
  <Holicon icon="arrowtip-next" size={20} color="red" />
</HoliButton>

<HoliButton label="Description" inline>
  <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
  <span>With Image</span>
</HoliButton>

<HoliButton label="Description">Fullwidth</HoliButton>
      `}</pre>
    </section>
  )
}

ButtonPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default ButtonPage
