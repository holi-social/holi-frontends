import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Term } from '@holi/core/screens/userprofile/types'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'

export type CreateSpaceTopicsProps = {
  onSelectSpaceTopics: (topics: Term[]) => void
  selectedTopics: Term[]
}

const CreateSpaceTopics: React.VFC<CreateSpaceTopicsProps> = ({
  onSelectSpaceTopics,
  selectedTopics,
}: CreateSpaceTopicsProps) => {
  const { t } = useTranslation()
  const { topics } = useContext(SpaceTermContext)
  const { setNextButtonEnabled } = useWizard()

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
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    alignItems: 'center',
    display: 'flex',
    backgroundColor: colors.background10,
  },
})
