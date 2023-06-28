import React from 'react'
import { useTranslation } from 'react-i18next'

import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'

type UserChipRowProps = {
  keyInUserObject: UserChipTypes
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
  const terms = user ? user[keyInUserObject] || [] : []
  const sortedTerms = [...terms].sort(termsByTitleComparator)
  const { t } = useTranslation()

  return (
    <HoliChipRow
      editable={!!onPressEdit}
      title={t(`profile.${keyInUserObject}`)}
      editButtonLabel={t(`profile.${keyInUserObject}.edit`)}
      onPressEdit={onPressEdit}
      testID={`user-profile-${keyInUserObject}`}
    >
      {sortedTerms.length > 0 ? (
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        sortedTerms.map((term) => (
          <HoliChip numberOfLines={numberOfLines} key={term.id} text={term.title} label={term.title} disabled />
        ))
      ) : (
        <HoliChip text={''} key="edit" onPress={onPressEdit} label={t(`profile.${keyInUserObject}.add`)} />
      )}
    </HoliChipRow>
  )
}

export default UserChipRow
