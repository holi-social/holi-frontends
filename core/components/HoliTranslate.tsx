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

interface HoliTranslateProps {
  description: string
  title: string
  setDescription: (description: string) => void
  setTitle: (title: string) => void
}

const HoliTranslate = ({ description, title, setDescription, setTitle }: HoliTranslateProps) => {
  const { t, i18n } = useTranslation()
  const [translate] = useLazyQuery<TranslateQueryRespone>(translateQuery)
  const [isTranslated, setIsTranslated] = useState(false)
  const [originalDescription, setOriginalDescription] = useState(description)
  const [originalTitle, setOriginalTitle] = useState(title)

  const onTranslate = async () => {
    if (isTranslated) {
      setDescription(originalDescription)
      setTitle(originalTitle)
    } else {
      const { data: translatedDescriptionData } = await translate({
        variables: {
          text: description,
          targetLanguage: i18n.language,
        },
      })

      const { data: translatedTitleData } = await translate({
        variables: {
          text: title,
          targetLanguage: i18n.language,
        },
      })

      setOriginalDescription(description)
      setOriginalTitle(title)
      setDescription(translatedDescriptionData?.translatedText ?? description)
      setTitle(translatedTitleData?.translatedText ?? title)
    }
    setIsTranslated(!isTranslated)
  }

  return (
    <HoliButton transparent label={'translate'} onPress={onTranslate}>
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
