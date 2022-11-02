import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import BackButton from '@holi/core/navigation/components/BackButton'
import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'

const DownButton = () => {
  const { t } = useTranslation()
  return <BackButton label={t('navigation.closeWindow')} icon="arrow-down-s" />
}
const CenterElement = () => <HeaderTitle style={{ paddingTop: 5 }} />

const TitleLeftElement = () => <HeaderTitle size="large" />

const LeftElement = () => <HeaderLeft style={{ paddingHorizontal: 0, marginLeft: 5 }} />

const RightElement = () => (
  <HeaderRight
    style={{
      paddingHorizontal: 0,
      marginRight: 5,
    }}
  />
)

const ItemRow: React.FC = ({ children }) => {
  return React.Children.toArray(children).length ? (
    <View style={styles.rowWrapper}>
      {React.Children.map(children, (item, idx) => (
        <View key={idx} style={styles.rowItem}>
          {item}
        </View>
      ))}
    </View>
  ) : (
    <>{children}</>
  )
}

export { BackButton, DownButton, CenterElement, TitleLeftElement, LeftElement, RightElement, ItemRow }

const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -12,
  },
  rowItem: {
    marginHorizontal: 12,
  },
})
