import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

const LocationStep = () => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliBox padding={[0, 0, 16, 0]}>
        <HoliHeading level="1" size="large" testID="headline">
          {t('registration.accountSetup.location.heading')}
        </HoliHeading>
      </HoliBox>
    </View>
  )
}

export default LocationStep
