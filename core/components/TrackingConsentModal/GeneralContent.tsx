import React from 'react'
import { useTranslation } from 'react-i18next'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { dimensions } from '@holi/ui/styles/globalVars'

import TrackingGeneralContentDescription from './TrackingGeneralContentDescription'

const GeneralContent = ({ hideDescription = false }) => {
  const { t } = useTranslation()

  return (
    <>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/icons/user-privacy.svg')}
        width={90}
        height={72}
        label={''}
        isSvg
      />

      <HoliGap size="m" />

      <HoliHeading level="2" size="l" weight="400">
        {t('tracking.consentModal.general.headline')}
      </HoliHeading>

      {!hideDescription && (
        <HoliBox padding={[dimensions.spacingS, 0, 0, 0]}>
          <TrackingGeneralContentDescription />
        </HoliBox>
      )}
    </>
  )
}

export default GeneralContent
