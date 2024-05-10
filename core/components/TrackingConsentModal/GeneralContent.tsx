import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import UserPrivacyPng from '@holi/ui/assets/img/icons/user-privacy.png'
import UserPrivacy from '@holi/ui/assets/img/icons/user-privacy.svg'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'

import TrackingGeneralContentDescription from './TrackingGeneralContentDescription'

const GeneralContent = () => {
  const { t } = useTranslation()

  return (
    <>
      <HoliLocalImage
        imageSource={Platform.OS === 'android' ? UserPrivacyPng : UserPrivacy}
        width={90}
        height={72}
        label={''}
        isSvg={Platform.OS !== 'android'}
      />

      <HoliGap size="m" />

      <HoliHeading level="2" size="l" weight="400">
        {t('tracking.consentModal.general.headline')}
      </HoliHeading>

      <HoliGap size="s" />

      <TrackingGeneralContentDescription />
    </>
  )
}

export default GeneralContent
