import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import { UserChipGeneric } from '@holi/core/screens/userprofile/types'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

import { toValuesWithTranslation } from './userChipHelper'

type UserChipRowProps = {
  typeMetadata: UserChipGeneric<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  onPressEdit: () => void
}

const UserChipRow: React.VoidFunctionComponent<UserChipRowProps> = ({ typeMetadata, onPressEdit }) => {
  const { user } = useContext(UserContext)
  const values = user ? (user[typeMetadata.keyInUserObject as keyof typeof user] as string[]) : []
  const { t } = useTranslation()

  const styles = getStyles()

  return (
    <HoliChipRow
      editable
      title={t(`profile.tabs.profile.${typeMetadata.keyInUserObject}`)}
      onPressEdit={() => onPressEdit()}
    >
      {values.length > 0 &&
        toValuesWithTranslation(typeMetadata.keyInUserObject, values, t).map((interest) => {
          return <HoliChip key={interest.name} text={interest.t} disabled style={styles.chip}></HoliChip>
        })}
      {values.length === 0 && (
        <HoliChip
          text={''}
          key="edit"
          onPress={() => onPressEdit()}
          accessibilityLabel={t('profile.tabs.profile.interests.add')}
          style={styles.chip}
        ></HoliChip>
      )}
    </HoliChipRow>
  )
}

const getStyles = () =>
  StyleSheet.create({
    chip: {
      marginRight: 8,
      marginBottom: 8,
    },
  })

export default UserChipRow
