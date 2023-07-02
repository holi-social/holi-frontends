import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import FormWrapper from '@holi/core/components/FormWrapper'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import SpaceNameAndGoalForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceNameAndGoalForm'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { UpdateSpaceInputSchema, updateSpaceMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface EditSpaceNameAndGoalProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceNameAndGoal: React.VFC<EditSpaceNameAndGoalProps> = ({
  space,
  onDismiss,
}: EditSpaceNameAndGoalProps) => {
  const [spaceName, setSpaceName] = useState<string>(space.title)
  const [spaceGoal, setSpaceGoal] = useState<string>(space.description)
  const [inputValid, setInputValid] = useState(true)
  const { openToast } = useToast()
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})
  const { handleGraphQLError } = useFieldErrors({ i18nPrefix: 'spaces', handledFieldErrors: ['title', 'description'] })
  const mixins = useStyleMixins()

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
    onError: (error) => setFieldErrors(handleGraphQLError(error)),
  })

  const { t } = useTranslation()

  const onSave = () => {
    updateSpace({ variables: { input: { id: space.id, title: spaceName, description: spaceGoal } } })
  }

  return (
    // <EditSpaceModal
    //   onDismiss={onDismiss}
    //   onSave={onSave}
    //   saveButtonDisabled={loading || !inputValid}
    //   persistFooter={Platform.OS !== 'android'}
    //   scrollable={false}
    // >
    <DefaultLayout
      headerOverlap={true}
      style={styles.layoutStyle}
      contentStyle={styles.contentStyle}
      scrollable={false}
    >
      <SpaceNameAndGoalForm
        title={t('spaces.input.nameAndGoal.title')}
        onChangeSpaceGoal={setSpaceGoal}
        onChangeSpaceName={setSpaceName}
        spaceGoal={spaceGoal}
        spaceName={spaceName}
        spaceNameErrors={fieldErrors.title}
        spaceGoalErrors={fieldErrors.description}
        loading={loading}
        onSave={onSave}
        saveButtonDisabled={loading || !inputValid}
      />
    </DefaultLayout>
    // </EditSpaceModal>

    // <SpaceNameAndGoalForm
    //   title={t('spaces.input.nameAndGoal.title')}
    //   onChangeSpaceGoal={setSpaceGoal}
    //   onChangeSpaceName={setSpaceName}
    //   spaceGoal={spaceGoal}
    //   spaceName={spaceName}
    //   spaceNameErrors={fieldErrors.title}
    //   spaceGoalErrors={fieldErrors.description}
    // />

    // <FormWrapper
    //   renderProp={(scrollToPropsFor) => (
    //     <View>
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliTextInput accessibilityLabel="" style={{ paddingTop: 100 }} {...scrollToPropsFor('name')} />
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliTextInput accessibilityLabel="" style={{ paddingTop: 100 }} {...scrollToPropsFor('lastName')} />
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliTextInput accessibilityLabel="" style={{ paddingTop: 100 }} {...scrollToPropsFor('1')} />
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliTextInput accessibilityLabel="" style={{ paddingTop: 100 }} {...scrollToPropsFor('2')} />
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliTextInput accessibilityLabel="" style={{ paddingTop: 100 }} {...scrollToPropsFor('3')} />
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit?
    //       </HoliHeading>
    //       <HoliTextInput accessibilityLabel="" style={{ paddingTop: 100 }} {...scrollToPropsFor('4')} />
    //       <HoliHeading>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi
    //         nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non
    //         facere neque sit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem
    //         omnis id, eaque sequi nulla minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam
    //         architecto est nam, non facere neque sit? Lorem ipsum dolor sit amet consectetur adipisicing elit.
    //         Necessitatibus exercitationem omnis id, eaque sequi nulla minima culpa? Asperiores, magnam laudantium
    //         dolores exercitationem aliquam architecto est nam, non facere neque sit? Lorem ipsum dolor sit amet
    //         consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi nulla minima culpa?
    //         Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non facere neque sit? Lorem
    //         ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus exercitationem omnis id, eaque sequi nulla
    //         minima culpa? Asperiores, magnam laudantium dolores exercitationem aliquam architecto est nam, non facere
    //         neque sit?
    //       </HoliHeading>
    //     </View>
    //   )}
    // />
  )
}

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: colors.background20,
  },
})

export default EditSpaceNameAndGoal
