import { useLazyQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { TranslateQueryRespone, translateQuery } from '@holi/core/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Translate } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'

type Translatable = {
  text: string
  setText: (text: string) => void
}

interface HoliTranslateProps {
  primaryText: Translatable
  secondaryText?: Translatable
  isTranslating?: boolean
}

const HoliTranslate: React.FC<HoliTranslateProps> = ({ primaryText, secondaryText }) => {
  const { t, i18n } = useTranslation()
  const [translate] = useLazyQuery<TranslateQueryRespone>(translateQuery)

  const [isTranslated, setIsTranslated] = useState(false)
  const [originalPrimaryText, setOriginalPrimaryText] = useState(primaryText.text)
  const [originalSecondaryText, setOriginalSecondaryText] = useState(secondaryText?.text || '')

  const onTranslate = async () => {
    if (isTranslated) {
      primaryText.setText(originalPrimaryText)
      if (secondaryText) {
        secondaryText.setText(originalSecondaryText)
      }
    } else {
      const { data: primaryTranslation } = await translate({
        variables: { text: primaryText.text, targetLanguage: i18n.language },
      })

      if (secondaryText) {
        const { data: secondaryTranslation } = await translate({
          variables: { text: secondaryText.text, targetLanguage: i18n.language },
        })

        setOriginalSecondaryText(secondaryText.text)
        secondaryText.setText(secondaryTranslation?.translatedText ?? secondaryText.text)
      }

      setOriginalPrimaryText(primaryText.text)
      primaryText.setText(primaryTranslation?.translatedText ?? primaryText.text)
    }
    setIsTranslated(!isTranslated)
  }

  return (
    <HoliButton transparent label={t('translation.button.label')} onPress={onTranslate}>
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
