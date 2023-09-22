import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliLoader from '@holi//ui/components/molecules/HoliLoader'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import type { SelectableTerm } from '@holi/core/screens/userprofile/components/UserChipForm'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
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
      <HoliBox padding={[0, 0, 16, 0]}>
        <HoliHeading level="1" size="large" testID="account-setup-interests-step-headline">
          {t('user.interests.form.headline')}
        </HoliHeading>
      </HoliBox>

      <UserChipForm {...props} />

      {props.loading && <HoliLoader />}
    </View>
  )
}

export default InterestsStep
