import { useMutation } from '@apollo/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { Space } from '@holi/api/graphql/graphql-codegen'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import SpaceNameAndGoalForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameAndGoalForm'
import { UpdateSpaceInputSchema, updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface EditSpaceNameAndGoalProps {
  space: Pick<Space, 'id' | 'title' | 'description'>
  onDismiss: () => void
}

const EditSpaceNameAndGoal = ({ space, onDismiss }: EditSpaceNameAndGoalProps) => {
  const [spaceName, setSpaceName] = useState<string>(space.title)
  const [spaceGoal, setSpaceGoal] = useState<string>(space.description ?? '')
  const [inputValid, setInputValid] = useState(true)
  const { openToast } = useToast()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const { handleGraphQLError } = useFieldErrors({ i18nPrefix: 'spaces', handledFieldErrors: ['title', 'description'] })

  useEffect(() => {
    const resultSchema = UpdateSpaceInputSchema.safeParse({
      id: space.id,
      title: spaceName,
      description: spaceGoal,
    })
    setInputValid(resultSchema.success)
    if (!resultSchema.success) {
      setFieldErrors(resultSchema.error.flatten().fieldErrors)
    } else {
      setFieldErrors({})
    }
  }, [spaceName, spaceGoal, space.id, setInputValid])

  const [updateSpace, { loading }] = useMutation(updateSpaceMutation, {
    onCompleted: () => {
      openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
        onDismiss()
      } else {
        setFieldErrors(handleGraphQLError(error))
      }
    },
  })

  const { t } = useTranslation()

  const onSave = () => updateSpace({ variables: { input: { id: space.id, title: spaceName, description: spaceGoal } } })

  return (
    <DefaultLayout
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
      scrollable={false}
    >
      <SpaceNameAndGoalForm
        onChangeSpaceGoal={setSpaceGoal}
        onChangeSpaceName={setSpaceName}
        spaceGoal={spaceGoal}
        spaceName={spaceName}
        spaceNameErrors={fieldErrors.title}
        spaceGoalErrors={fieldErrors.description}
        onSave={onSave}
        saveButtonDisabled={loading || !inputValid}
      />
    </DefaultLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layoutStyle: {
      flex: 1,
    },
    contentStyle: {
      flex: 1,
      paddingBottom: 0,
      backgroundColor: theme.colors.background20,
    },
  })

export default EditSpaceNameAndGoal
