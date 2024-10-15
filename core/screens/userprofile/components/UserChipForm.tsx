import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Term } from '@holi/core/domain/shared/types'
import { Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import ChipSelect from '@holi/ui/no-name/components/chips/ChipSelect'
import { Color } from '@holi/ui/no-name/foundations/colors/primitives'

export interface SelectableTerm extends Term {
  selected?: boolean
}

type UserChipFormProps = {
  keyInUserObject: string
  filterString?: string
  onFilterStringChange: (value: string) => void
  terms: SelectableTerm[]
  onTermSelect: (id: string) => void
  color?: Color
}

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({
  filterString,
  onFilterStringChange,
  terms,
  onTermSelect,
  keyInUserObject,
  color = 'green',
}: UserChipFormProps) => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliText style={styles.subline}>{t(`user.${keyInUserObject}.form.subline`)}</HoliText>

      <HoliTextInput
        aria-label={t(`profile.${keyInUserObject}.filter.placeholder`)}
        value={filterString}
        placeholder={t(`profile.${keyInUserObject}.filter.placeholder`)}
        onChange={onFilterStringChange}
        trailingIcon={Search}
        style={styles.input}
      />

      <HoliChipRow editable={false} editButtonLabel="">
        {terms.map(({ id, selected, title }) => (
          <ChipSelect key={id} onPress={() => onTermSelect(id)} selected={selected} selectedColor={color}>
            {title}
          </ChipSelect>
        ))}
      </HoliChipRow>

      {terms.length === 0 && <HoliText style={styles.subline}>{t(`profile.${keyInUserObject}.filter.empty`)}</HoliText>}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 150,
  },
  headline: {
    marginBottom: 16,
  },
  subline: {
    marginBottom: 24,
    textAlign: 'left',
  },
  input: {
    marginBottom: 16,
  },
})

export default UserChipForm
