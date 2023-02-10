import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import SpaceNameAndGoalForm from '@holi/core/screens/spaces/components/SpaceForms/SpaceNameAndGoalForm'
import { updateSpaceMutation } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type EditSpaceNameAndGoalProps = {
  space: Space
  onDismiss: () => void
}

const EditSpaceNameAndGoal: React.VFC<EditSpaceNameAndGoalProps> = ({
  space,
  onDismiss,
}: EditSpaceNameAndGoalProps) => {
  const [spaceName, setSpaceName] = useState<string>(space.title)
  const [spaceGoal, setSpaceGoal] = useState<string>(space.description)
  const { openToast } = useToast()

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: () => openToast(t('global.technicalError'), HoliToastType.ERROR),
  })

  const mixins = useStyleMixins()

  const { t } = useTranslation()

  const onSave = () => {
    updateSpace({ variables: { input: { id: space.id, title: spaceName, description: spaceGoal } } })
  }

  return (
    <DefaultLayout
      headerOverlap={true}
      scrollEnabled={false}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
    >
      <SpaceNameAndGoalForm
        title={t('spaces.edit.nameAndGoal')}
        onChangeSpaceGoal={setSpaceGoal}
        onChangeSpaceName={setSpaceName}
        spaceGoal={spaceGoal}
        spaceName={spaceName}
      />
      <View style={[mixins.container, styles.footer]}>
        <HoliButton label={t('global.dismiss')} type="secondary" inline style={styles.footerButton} onPress={onDismiss}>
          {t('global.dismiss')}
        </HoliButton>
        <HoliButton
          label={t('global.save')}
          inline
          disabled={loading || !spaceName || spaceName.length < 1 || !spaceGoal || spaceGoal.length < 1}
          style={styles.footerButton}
          onPress={onSave}
        >
          {t('global.save')}
        </HoliButton>
      </View>
    </DefaultLayout>
  )
}

export default EditSpaceNameAndGoal

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: colors.background30,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
  footerButton: {
    flex: 1,
    margin: 7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
})
