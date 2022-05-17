import { NextPage } from 'next'
import Link from 'next/link'

import Button from '@holi/ui/components/Button'
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
        <HoliButton inline disabled>
          Disabled
        </HoliButton>
        <HoliButton inline style={{ marginLeft: 10 }}>
          <span>With Icon</span>
          <Holicon icon="arrowtip-next" size={20} color="red" />
        </HoliButton>
        <HoliButton inline style={{ marginLeft: 10 }}>
          <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
          <span>With Image</span>
        </HoliButton>
        <HoliButton>Fullwidth</HoliButton>

        <br></br>

        <Button>Hello</Button>
        <Button style={{ marginLeft: 10 }}>
          <span>With Icon</span>
          <Holicon icon="arrowtip-next" size={20} color="red" />
        </Button>
        <Button style={{ marginLeft: 10 }}>
          <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
          <span>With Image</span>
        </Button>

        <Button fullWidth style={{ marginTop: 10 }}>
          Fullwidth
        </Button>
      </div>

      <pre className={sassStyles.code}>{`
import Button from '@holi/ui/components/Button'

<Button inline disabled>Hello</Button>

<Button inline>
  <span>With Icon</span>
  <Holicon icon="arrowtip-next" size={20} color='red' />
</Button>

<Button inline>
  <SharedImage imageFile={require('@holi/ui/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
  <span>With Image</span>
</Button>

<Button>Fullwidth</Button>
      `}</pre>
    </section>
  )
}

export default ButtonPage
