import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { Term } from '@holi/core/screens/userprofile/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

type UserChipRowProps = {
  keyInUserObject: string
  onPressEdit?: () => void
  numberOfLines?: number
  user: User
}

const UserChipRow: React.VoidFunctionComponent<UserChipRowProps> = ({
  onPressEdit,
  numberOfLines,
  user,
  keyInUserObject,
}: UserChipRowProps) => {
  const terms = user ? (user[keyInUserObject as keyof typeof user] as Term[]) : []
  const { t } = useTranslation()

  const styles = getStyles()

  return (
    <HoliChipRow
      editable={!!onPressEdit}
      title={t(`profile.${keyInUserObject}`)}
      editButtonLabel={t(`profile.${keyInUserObject}.edit`)}
      onPressEdit={onPressEdit}
      testID={`user-profile-${keyInUserObject}`}
    >
      {terms.length > 0 ? (
        terms.map((term) => (
          <HoliChip
            numberOfLines={numberOfLines}
            key={term.id}
            text={term.title}
            label={term.title}
            disabled
            style={styles.chip}
          />
        ))
      ) : (
        <HoliChip
          text={''}
          key="edit"
          onPress={onPressEdit}
          label={t(`profile.${keyInUserObject}.add`)}
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
