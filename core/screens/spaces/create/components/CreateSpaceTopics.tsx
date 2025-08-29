import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { TermsInput } from '@holi/core/components/TermsInput'

export type CreateSpaceTopicsProps = {
  onSelectSpaceTopics: (topics: string[]) => void
  selectedTopics: string[]
}

const CreateSpaceTopics: React.FC<CreateSpaceTopicsProps> = ({
  onSelectSpaceTopics,
  selectedTopics,
}: CreateSpaceTopicsProps) => {
  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useEffect(() => {
    setNextButtonEnabled(selectedTopics.length > 0)
  }, [selectedTopics, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <TermsInput
        title={t('spaces.create.stepTwo.title')}
        description={t('spaces.input.topics.description')}
        searchPlaceholder={t('spaces.input.topics.search')}
        hint={t('spaces.input.topics.hint')}
        selected={[...selectedTopics]}
        onSelect={onSelectSpaceTopics}
        termType="topic"
      />
    </View>
  )
}

export default CreateSpaceTopics
const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      width: '100%',
      ...Platform.select({
        web: {
          minHeight: '100vh' as DimensionValue,
        },
      }),
      alignItems: 'center',
      display: 'flex',
      backgroundColor: theme.colors.background10,
    },
  })
