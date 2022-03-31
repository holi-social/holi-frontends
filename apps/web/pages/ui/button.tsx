import { NextPage } from 'next'
import Link from 'next/link'
import Holicon from '@holi/ui/holicon'
import SharedImage from '@holi/ui/sharedImage'
import Button from '@holi/ui/Button'
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
        <Button style={{}}>Hello</Button>
        <Button style={{ marginLeft: 10 }}>
          <span>With Icon</span>
          <Holicon icon="arrowtip-next" size={20} color="red" />
        </Button>
        <Button style={{ marginLeft: 10 }}>
          <SharedImage imageFile={require('@holi/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
          <span>With Image</span>
        </Button>
      </div>

      <pre className={sassStyles.code}>{`
import Button from '@holi/ui/Button'

<Button>Hello</Button>

<Button>
  <span>With Icon</span>
  <Holicon icon="arrowtip-next" size={20} color='red' />
</Button>

<Button>
  <SharedImage imageFile={require('@holi/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
  <span>With Image</span>
</Button>
      `}</pre>
    </section>
  )
}

export default ButtonPage
