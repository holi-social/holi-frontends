import Link from 'next/link'
import { ReactElement, useState } from 'react'

import HoliChip from '@holi/ui/components/HoliChip'
import Holicon from '@holi/ui/components/holicon'
import { UiLayout } from '@holi/web/layout/UiLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import sassStyles from './ui.module.scss'

const ChipPage: NextPageWithLayout = () => {
  const [checked, setChecked] = useState(false)
  return (
    <section>
      {/* ===== Header section ===== */}
      <div className={sassStyles.headline}>
        <Link href="/ui">
          <a>
            <Holicon icon="arrow-back" size={50} />
          </a>
        </Link>
        <h1>Chip</h1>
      </div>

      {/* ===== Demo section ===== */}
      <div className={sassStyles.example}>
        <HoliChip label="Nothing to do here" onPress={() => setChecked(!checked)} checked={checked}>
          Selectable
        </HoliChip>

        <HoliChip label="Nothing to do here" disabled style={{ marginLeft: 10 }}>
          Disabled
        </HoliChip>
      </div>

      {/* ===== Code to copy section ===== */}
      <pre className={sassStyles.code}>{`
import HoliChip from '@holi/ui/components/HoliChip'

const [checked, setChecked] = useState(false)

<HoliChip label="Nothing to do here" onPress={() => setChecked(!checked)} checked={checked}>
  Selectable
</HoliChip>

<HoliChip label="Nothing to do here" disabled style={{ marginLeft: 10 }}>
  Disabled
</HoliChip>

`}</pre>
    </section>
  )
}

ChipPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default ChipPage
