import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export type SpaceLinksFormProps = {
  onChangeUrl: (name: string) => void
  onChangeName: (name: string) => void
  title: string
  url: string | undefined
  name: string | undefined
  validationErrorTextUrl?: string
  validationErrorTextName?: string
}

const SpaceLinksForm: React.VFC<SpaceLinksFormProps> = ({
  onChangeUrl,
  onChangeName,
  title,
  url,
  name,
  validationErrorTextUrl,
  validationErrorTextName,
}: SpaceLinksFormProps) => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliText size="extralarge" style={styles.title}>
        {title}
      </HoliText>
      <HoliTextInput
        placeholder={t('spaces.input.socialLinks.url.placeholder')}
        inputLabel={t('spaces.input.socialLinks.url.label')}
        maxNoOfCharacters={500}
        validationErrorText={validationErrorTextUrl}
        value={url}
        onChange={onChangeUrl}
        accessibilityLabel={t('spaces.input.socialLinks.url.label')}
        testID="space-link-url"
        inputProps={{ autoFocus: true }}
        style={styles.input}
      />
      <HoliTextInput
        placeholder={t('spaces.input.socialLinks.name.placeholder')}
        inputLabel={t('spaces.input.socialLinks.name.label')}
        maxNoOfCharacters={100}
        value={name}
        onChange={onChangeName}
        accessibilityLabel={t('spaces.input.socialLinks.name.label')}
        testID="space-link-name"
        validationErrorText={validationErrorTextName}
      />
    </View>
  )
}

export default SpaceLinksForm

const styles = StyleSheet.create({
  title: {
    marginVertical: 40,
  },
  input: {
    marginBottom: 16,
  },
})
