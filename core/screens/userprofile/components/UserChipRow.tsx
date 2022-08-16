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
  numberOfLines?: number
  sortByTranslation?: boolean
}

const UserChipRow: React.VoidFunctionComponent<UserChipRowProps> = ({
  typeMetadata,
  onPressEdit,
  numberOfLines,
  sortByTranslation = true,
}) => {
  const { user } = useContext(UserContext)
  const values = user ? (user[typeMetadata.keyInUserObject as keyof typeof user] as string[]) : []
  const { t } = useTranslation()

  const styles = getStyles()

  return (
    <HoliChipRow
      editable
      title={t(`profile.${typeMetadata.keyInUserObject}`)}
      onPressEdit={() => onPressEdit()}
      testID={`user-profile-${typeMetadata.keyInUserObject}`}
    >
      {values.length > 0 ? (
        toValuesWithTranslation(typeMetadata, values, t, sortByTranslation).map((valueWithT) => (
          <HoliChip
            numberOfLines={numberOfLines}
            key={valueWithT.value}
            text={valueWithT.t}
            disabled
            style={styles.chip}
          />
        ))
      ) : (
        <HoliChip
          text={''}
          key="edit"
          onPress={() => onPressEdit()}
          label={t(`profile.${typeMetadata.keyInUserObject}.add`)}
          style={styles.chip}
        />
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
