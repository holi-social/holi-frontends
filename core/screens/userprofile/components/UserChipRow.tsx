import React from 'react'
import { useTranslation } from 'react-i18next'

import { User, termsByTitleComparator } from '@holi/core/domain/shared/types'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import { Add } from '@holi/icons/src/generated'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import ChipAction from '@holi/ui/no-name/components/chips/ChipAction'
import ChipLabel from '@holi/ui/no-name/components/chips/ChipLabel'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

type UserChipRowProps = {
  keyInUserObject: UserChipTypes
  onPressEdit?: () => void
  numberOfLines?: number
  user: User
  color: Color | 'white'
}

const UserChipRow: React.VoidFunctionComponent<UserChipRowProps> = ({
  onPressEdit,
  user,
  keyInUserObject,
  color = 'mono',
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
      {sortedTerms.length > 0 || !onPressEdit ? (
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        sortedTerms.map((term) => (
          <ChipLabel key={term.id} color={color}>
            {term.title}
          </ChipLabel>
        ))
      ) : (
        <ChipAction key="edit" onPress={onPressEdit} color="white" iconTrailing={Add} />
      )}
    </HoliChipRow>
  )
}

export default UserChipRow
