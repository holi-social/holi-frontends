import { NextPage } from 'next'
import Link from 'next/link'

import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import SharedImage from '@holi/ui/components/sharedImage'

import sassStyles from './ui.module.scss'

const ButtonPage: NextPage = () => {
  return (
    <section>
      <div className={sassStyles.headline}>
        <Link href="/ui">
          <a>
            <Holicon icon="arrow-back" size={50} />
          </a>
        </Link>
        <h1>Button</h1>
      </div>

      <div className={sassStyles.example}>
        <HoliButton label="nothing to do here" testID="someId" inline disabled>
          Disabled
        </HoliButton>
        <HoliButton
          label="Öffne dialog"
          onPress={() => alert('##### some alert message')}
          inline
          active
          style={{ marginLeft: 10 }}
        >
          aktiv
        </HoliButton>
        <HoliButton label="Beschreibung" inline style={{ marginLeft: 10 }}>
          <span>With Icon</span>
          <Holicon icon="arrowtip-next" size={20} color="red" />
        </HoliButton>
        <HoliButton label="Go to" inline style={{ marginLeft: 10 }}>
          <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
          <span>With Image</span>
        </HoliButton>
        <HoliButton label="Go to">Fullwidth</HoliButton>
      </div>

      <pre className={sassStyles.code}>{`
import HoliButton from '@holi/ui/components/HoliButton'

<HoliButton inline disabled>Hello</HoliButton>

<HoliButton inline active>Active</HoliButton>

<HoliButton inline>
  <span>With Icon</span>
  <Holicon icon="arrowtip-next" size={20} color='red' />
</HoliButton>

<HoliButton inline>
  <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
  <span>With Image</span>
</HoliButton>

<HoliButton>Fullwidth</HoliButton>
      `}</pre>
    </section>
  )
}

export default ButtonPage
