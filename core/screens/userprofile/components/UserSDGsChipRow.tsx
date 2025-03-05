import { ChipAction, ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useTranslation } from 'react-i18next'

import { type User, termsByTitleComparator } from '@holi/core/domain/shared/types'
import { Add } from '@holi/icons/src/generated'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'

type UserSDGsChipRowProps = {
  onPressEdit?: () => void
  user: User
}

export const UserSDGsChipRow = ({ onPressEdit, user }: UserSDGsChipRowProps) => {
  const keyInUserObject = UserChipTypes.SDGS
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
      {sortedTerms.length > 0 || !onPressEdit ? (
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        sortedTerms.map((term) => (
          <ChipLabel key={term.id} color="white" testID={`${keyInUserObject}--${term.slug}`}>
            {term.title}
          </ChipLabel>
        ))
      ) : (
        <ChipAction
          onPress={onPressEdit}
          color="white"
          iconTrailing={Add}
          aria-label={t(`profile.${keyInUserObject}.add`)}
        />
      )}
    </HoliChipRow>
  )
}

export default UserSDGsChipRow
