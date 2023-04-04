import React, { useEffect } from 'react'
import { View } from 'react-native'

import HoliLoader from '@holi//ui/components/molecules/HoliLoader'
import useWizard from '@holi//ui/components/organisms/HoliWizard/useWizard'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import type { SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'

export interface UseUserChipsReturn {
  filterString: string
  onFilterStringChange: (value: string) => void
  terms: SelectableTerm[]
  onTermSelect: (id: string) => void
  loading: boolean
  keyInUserObject: string
}

const InterestsStep = (props: UseUserChipsReturn) => {
  const { setNextButtonEnabled } = useWizard()

  useEffect(() => setNextButtonEnabled(true), [setNextButtonEnabled])

  return (
    <View>
      <UserChipForm {...props} />

      {props.loading && <HoliLoader />}
    </View>
  )
}

export default InterestsStep
