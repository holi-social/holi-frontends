import { useMutation } from '@apollo/client'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import InterestsStep from '@holi/core/auth/components/AccountSetup/InterestsStep'
import NamesStep, { trimNames } from '@holi/core/auth/components/AccountSetup/NamesStep'
import RegistrationSuccessStep from '@holi/core/auth/components/AccountSetup/RegistrationSuccessStep'
import { useUserChips } from '@holi/core/helpers/useUserChips'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import {
  UpdateAuthenticatedUserResponse,
  interestsQuery,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'

interface AccountSetupProps {
  onFinish: () => void
}

const AccountSetup = ({ onFinish }: AccountSetupProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { user } = useLoggedInUser()

  // User Names step logic
  const [updateUser] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)

  const [names, setNames] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    pronouns: user?.pronouns ?? '',
  })

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

  // Interests step logic
  const keyInUserObject = 'interests'
  const {
    filterString,
    onFilterStringChange,
    terms,
    onTermSelect,
    loading: loadingUserInterests,
  } = useUserChips({ user, queryToUse: interestsQuery, keyInUserObject })

  // HoliWizard event handlers
  const handleNextButtonPress = useCallback(async () => {
    let success = false
    const trimmedNames = trimNames(names)
    const selectedInterestIds = terms.reduce((acc, { id, selected }) => (selected ? [...acc, id] : acc), [] as string[])

    await updateUser({
      variables: { input: { ...trimmedNames, interests: [...selectedInterestIds] } },
      onCompleted: () => (success = true),
    })

    return success
  }, [names, terms, updateUser])

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

      {/* Interests step */}
      <InterestsStep
        filterString={filterString}
        onFilterStringChange={onFilterStringChange}
        terms={terms}
        onTermSelect={onTermSelect}
        loading={loadingUserInterests}
        keyInUserObject={keyInUserObject}
      />

      {/* Pre-Success step */}
      <RegistrationSuccessStep firstName={names.firstName} />
    </HoliWizard>
  )
}

export default AccountSetup
