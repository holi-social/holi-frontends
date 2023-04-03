import { useMutation } from '@apollo/client'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import NamesStep, { trimNames } from '@holi/core/auth/components/AccountSetup/NamesStep'
import RegistrationSuccessStep from '@holi/core/auth/components/AccountSetup/RegistrationSuccessStep'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UpdateAuthenticatedUserResponse, updateUserMutation } from '@holi/core/screens/userprofile/queries'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'

interface AccountSetupProps {
  onFinish: () => void
}

const AccountSetup = ({ onFinish }: AccountSetupProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const [updateUser] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)

  const [names, setNames] = useState({ firstName: '', lastName: '', pronouns: '' })

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

  const handleNextButtonPress = useCallback(async () => {
    let success = false
    const trimmedNames = trimNames(names)

    await updateUser({
      variables: { input: trimmedNames },
      onCompleted: () => (success = true),
    })

    return success
  }, [names, updateUser])

  const handleSubmitButtonPress = useCallback(async () => {
    onFinish()
    navigate('/profile')
  }, [navigate, onFinish])

  return (
    <HoliWizard
      isBackButtonAvailable={true}
      submitButtonLabel={t('global.next')}
      onNextPress={handleNextButtonPress}
      onSubmit={handleSubmitButtonPress}
      ref={scrollViewRef}
    >
      {/* Names step */}
      <NamesStep names={names} setNames={setNames} scrollToInputWithId={scrollToInputWithId} />
      {/* Pre-Success step */}
      <RegistrationSuccessStep firstName={names.firstName} />
    </HoliWizard>
  )
}

export default AccountSetup
