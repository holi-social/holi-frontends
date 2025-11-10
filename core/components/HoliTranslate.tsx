import { useLazyQuery } from '@apollo/client/react'
import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { type TranslateQueryRespone, translateQuery } from '@holi/core/queries'
import type { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Translate } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import Spacing from '@holi/ui/foundations/Spacing'

type Translatable = {
  text: string
  setText: (text: string) => void
}

interface HoliTranslateProps {
  primaryText: Translatable
  secondaryText?: Translatable
  loading?: boolean
  setLoading: (_: boolean) => void
  trackingEvent: TrackingEvent
}

const HoliTranslate: React.FC<HoliTranslateProps> = ({
  primaryText,
  secondaryText,
  loading,
  setLoading,
  trackingEvent,
}) => {
  const { track } = useTracking()
  const { t, i18n } = useTranslation()
  const { openToast } = useToast()
  const [translate] = useLazyQuery<TranslateQueryRespone>(translateQuery)

  const [isTranslated, setIsTranslated] = useState(false)
  const [originalPrimaryText, setOriginalPrimaryText] = useState(primaryText.text)
  const [originalSecondaryText, setOriginalSecondaryText] = useState(secondaryText?.text || '')

  const onTranslate = async () => {
    setLoading(true)
    if (isTranslated) {
      primaryText.setText(originalPrimaryText)
      if (secondaryText) {
        secondaryText.setText(originalSecondaryText)
      }
    } else {
      const { data: primaryTranslation, error: primaryError } = await translate({
        variables: { text: primaryText.text, targetLanguage: i18n.language },
      })
      if (primaryError) {
        openToast(t('global.technicalError'), HoliToastType.ERROR)
      }

      if (secondaryText) {
        const { data: secondaryTranslation, error: secondaryError } = await translate({
          variables: { text: secondaryText.text, targetLanguage: i18n.language },
        })
        if (secondaryError && !primaryError) {
          openToast(t('global.technicalError'), HoliToastType.ERROR)
        }

        setOriginalSecondaryText(secondaryText.text)
        secondaryText.setText(secondaryTranslation?.translatedText ?? secondaryText.text)
      }
      track(trackingEvent)
      setOriginalPrimaryText(primaryText.text)
      primaryText.setText(primaryTranslation?.translatedText ?? primaryText.text)
    }
    setIsTranslated(!isTranslated)
    setLoading(false)
  }

  return (
    <HoliButton transparent label={t('translation.button.label')} onPress={onTranslate} disabled={loading}>
      <View style={styles.container}>
        <HoliIcon icon={Translate} size={16} />
        <HoliText bold size="small">
          {isTranslated ? t('translation.button.showOriginal.label') : t('translation.button.label')}
        </HoliText>
      </View>
    </HoliButton>
  )
}

export default HoliTranslate

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing['4xs'],
  },
})
