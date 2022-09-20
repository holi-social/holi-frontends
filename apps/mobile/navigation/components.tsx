import React from 'react'
import { useTranslation } from 'react-i18next'

import BackButton from '@holi/core/navigation/components/BackButton'
import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'

const DownButton = () => {
  const { t } = useTranslation()
  return <BackButton label={t('navigation.closeWindow')} icon="arrow-down-s" />
}
const CenterElement = () => <HeaderTitle style={{ paddingTop: 5 }} />
const LeftElement = () => <HeaderLeft style={{ paddingHorizontal: 0, marginLeft: 5 }} />
const RightElement = () => (
  <HeaderRight
    style={{
      paddingHorizontal: 0,
      marginRight: 5,
    }}
  />
)

export { BackButton, DownButton, CenterElement, LeftElement, RightElement }
