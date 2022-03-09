import { NextPage } from 'next'
import Link from 'next/link'
import Holicon from 'shared/components/ui/holicon'
import SharedImage from 'shared/components/ui/sharedImage'
import Button from 'shared/components/ui/Button'
import sassStyles from './ui.module.scss'


const ButtonPage: NextPage = () => {
  return (
    <section>
      <div className={sassStyles.headline}>
        <Link href="/ui"><a><Holicon icon="arrow-back" size={50} /></a></Link>
        <h1>Button</h1>
      </div>

      <div className={sassStyles.example}>
        <Button style={{}}>Hello</Button>
        <Button style={{marginLeft: 10}}>
          <span>With Icon</span>
          <Holicon icon="arrowtip-next" size={20} color='red' />
        </Button>
        <Button style={{marginLeft: 10}}>
          <SharedImage imageFile={require('shared/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
          <span>With Image</span>
        </Button>
      </div>

      <pre className={sassStyles.code}>{`
import Button from 'shared/components/ui/Button'

<Button>Hello</Button>

<Button>
  <span>With Icon</span>
  <Holicon icon="arrowtip-next" size={20} color='red' />
</Button>

<Button>
  <SharedImage imageFile={require('shared/assets/img/logo/logo.svg')} style={{ width: 50, height: 50 }} />
  <span>With Image</span>
</Button>
      `}</pre>
    </section>
  )
}

export default ButtonPage
