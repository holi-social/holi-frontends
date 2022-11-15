import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { Term, UserChipGeneric } from '@holi/core/screens/userprofile/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

type UserChipRowProps = {
  typeMetadata: UserChipGeneric<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  onPressEdit?: () => void
  numberOfLines?: number
  sortByTranslation?: boolean
  user: User
}

const UserChipRow: React.VoidFunctionComponent<UserChipRowProps> = ({
  typeMetadata,
  onPressEdit,
  numberOfLines,
  user,
  sortByTranslation = true,
}) => {
  const values = user ? (user[typeMetadata.keyInUserObject as keyof typeof user] as Term[]) : []
  const { t } = useTranslation()

  const styles = getStyles()

  return (
    <HoliChipRow
      editable={!!onPressEdit}
      title={t(`profile.${typeMetadata.keyInUserObject}`)}
      editButtonLabel={t(`profile.${typeMetadata.keyInUserObject}.edit`)}
      onPressEdit={onPressEdit}
      testID={`user-profile-${typeMetadata.keyInUserObject}`}
    >
      {values.length > 0 ? (
        values.map((value) => (
          <HoliChip
            numberOfLines={numberOfLines}
            key={value.id}
            text={value.title}
            label={value.title}
            disabled
            style={styles.chip}
          />
        ))
      ) : (
        <HoliChip
          text={''}
          key="edit"
          onPress={onPressEdit}
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
