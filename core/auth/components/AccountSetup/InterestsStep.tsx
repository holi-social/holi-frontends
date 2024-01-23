import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliLoader from '@holi//ui/components/molecules/HoliLoader'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import type { SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

export interface UseUserChipsReturn {
  filterString: string
  onFilterStringChange: (value: string) => void
  terms: SelectableTerm[]
  onTermSelect: (id: string) => void
  loading: boolean
  keyInUserObject: string
}

const InterestsStep = (props: UseUserChipsReturn) => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliHeading level="1" size="large" testID="account-setup-interests-step-headline">
        {t('user.interests.form.headline')}
      </HoliHeading>

      <HoliGap size="s" />
      <UserChipForm {...props} />

      {props.loading && <HoliLoader />}
    </View>
  )
}

export default InterestsStep
