import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

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

const SpaceLinksForm: React.FC<SpaceLinksFormProps> = ({
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
        placeholder={t('spaces.input.publicLinks.url.placeholder')}
        inputLabel={t('spaces.input.publicLinks.url.label')}
        maxNoOfCharacters={500}
        validationErrorText={validationErrorTextUrl}
        value={url}
        onChange={onChangeUrl}
        aria-label={t('spaces.input.publicLinks.url.label')}
        testID="space-link-url"
        inputProps={{ autoFocus: true }}
        style={styles.input}
        isRequired
      />
      <HoliTextInput
        placeholder={t('spaces.input.publicLinks.name.placeholder')}
        inputLabel={t('spaces.input.publicLinks.name.label')}
        maxNoOfCharacters={100}
        value={name}
        onChange={onChangeName}
        aria-label={t('spaces.input.publicLinks.name.label')}
        testID="space-link-name"
        validationErrorText={validationErrorTextName}
        isRequired
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 24,
  },
  input: {
    marginBottom: 16,
  },
})

export default SpaceLinksForm
