import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View } from 'react-native'

import { Term } from '@holi/core/domain/shared/types'
import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type CreateSpaceTopicsProps = {
  onSelectSpaceTopics: (topics: Term[]) => void
  selectedTopics: Term[]
}

const CreateSpaceTopics: React.FC<CreateSpaceTopicsProps> = ({
  onSelectSpaceTopics,
  selectedTopics,
}: CreateSpaceTopicsProps) => {
  const { t } = useTranslation()
  const { topics } = useContext(SpaceTermContext)
  const { setNextButtonEnabled } = useWizard()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useEffect(() => {
    setNextButtonEnabled(selectedTopics.length > 0)
  }, [selectedTopics, setNextButtonEnabled])

  return (
    <View style={styles.wrapper}>
      <SpaceTermsInput
        title={t('spaces.create.stepTwo.title')}
        description={t('spaces.input.topics.description')}
        searchPlaceholder={t('spaces.input.topics.search')}
        hint={t('spaces.input.topics.hint')}
        selected={[...selectedTopics]}
        onSelect={onSelectSpaceTopics}
        terms={topics}
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
