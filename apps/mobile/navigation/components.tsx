import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import BackButton from '@holi/core/navigation/components/BackButton'
import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

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

const IconButtonRow = ({
  tintColor,
  buttonProps,
}: HeaderButtonProps & { buttonProps: { icon: string; label: string; onPress: () => void }[] }) => (
  <View style={{ flexDirection: 'row', marginHorizontal: -12 }}>
    {buttonProps.map(({ icon, label, onPress }) => (
      <View key={label} style={{ marginHorizontal: 12 }}>
        <HoliButton label={label} inline transparent onPress={onPress}>
          <HoliIcon icon={icon} size={24} color={tintColor} />
        </HoliButton>
      </View>
    ))}
  </View>
)

export { BackButton, DownButton, CenterElement, TitleLeftElement, LeftElement, RightElement, IconButtonRow }
