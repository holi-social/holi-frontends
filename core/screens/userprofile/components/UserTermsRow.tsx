import { ChipAction, ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useTranslation } from 'react-i18next'

import type { TermType } from '@holi/core/domain/shared/types'
import { Add } from '@holi/icons/src/generated'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import { useSortedUserTerms } from '@holi/core/domain/shared/useSortedUserTerms'

type UserTermsRowProps = {
  onPressEdit?: () => void
  termType: TermType
}

export const UserTermsRow = ({ onPressEdit, termType }: UserTermsRowProps) => {
  const sortedTerms = useSortedUserTerms(termType)
  const i18nKey = termType === 'topic' ? 'interests' : 'skills'
  const { t } = useTranslation()

  return (
    <HoliChipRow
      editable={!!onPressEdit}
      title={t(`profile.${i18nKey}`)}
      editButtonLabel={t(`profile.${i18nKey}.edit`)}
      onPressEdit={onPressEdit}
      testID={`user-profile-${i18nKey}`}
    >
      {sortedTerms.length > 0 || !onPressEdit ? (
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        sortedTerms.map((term) => (
          <ChipLabel key={term} color={termType === 'topic' ? 'green' : 'blue'} testID={`${i18nKey}--${term}`}>
            {t(`${termType}.${term}`)}
          </ChipLabel>
        ))
      ) : (
        <ChipAction onPress={onPressEdit} color="white" iconTrailing={Add} aria-label={t(`profile.${i18nKey}.add`)} />
      )}
    </HoliChipRow>
  )
}
