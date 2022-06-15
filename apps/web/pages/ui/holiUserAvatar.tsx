import Link from 'next/link'
import { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'
import Holicon from '@holi/ui/components/holicon'
import { UiLayout } from '@holi/web/layout/UiLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import sassStyles from './ui.module.scss'

const ButtonPage: NextPageWithLayout = () => {
  const imgUrl = undefined
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
      <div className={sassStyles.example} style={{ display: 'flex' }}>
        <View style={styles.bubble}>
          <HoliUserAvatar nameLabel="Uschi" imageSrc={imgUrl} defaultColor="red" size="extralarge" />
          <Text style={styles.text}>extralarge</Text>
        </View>
        <View style={styles.bubble}>
          <HoliUserAvatar nameLabel="some Name" imageSrc={imgUrl} defaultColor="pink" size="large" />
          <Text style={styles.text}>large</Text>
        </View>
        <View style={styles.bubble}>
          <HoliUserAvatar nameLabel="Karl Heinz" imageSrc={imgUrl} defaultColor="violet" />
          <Text style={styles.text}>medium</Text>
        </View>
        <View style={styles.bubble}>
          <HoliUserAvatar nameLabel="Uschi Meyer" imageSrc={imgUrl} defaultColor="blue" size="small" />
          <Text style={styles.text}>small</Text>
        </View>
        <View style={styles.bubble}>
          <HoliUserAvatar nameLabel="Manni" imageSrc={imgUrl} defaultColor="yellow" size="micro" />
          <Text style={styles.text}>micro</Text>
        </View>
      </div>

      {/* ===== Code to copy section ===== */}
      <pre className={sassStyles.code}>{`
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

<HoliUserAvatar nameLabel="Uschi" imageSrc={imgUrl}  defaultColor="red" size="extralarge" />
`}</pre>
    </section>
  )
}

ButtonPage.getLayout = (page: ReactElement) => <UiLayout>{page}</UiLayout>

export default ButtonPage

const styles = StyleSheet.create({
  bubble: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 20,
    justifyContent: 'flex-end',
  },
  text: {
    marginTop: 10,
  },
})
