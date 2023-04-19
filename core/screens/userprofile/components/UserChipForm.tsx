import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { Term } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'

export interface SelectableTerm extends Term {
  selected?: boolean
}

type UserChipFormProps = {
  keyInUserObject: string
  filterString?: string
  onFilterStringChange: (value: string) => void
  terms: SelectableTerm[]
  onTermSelect: (id: string) => void
}

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({
  filterString,
  onFilterStringChange,
  terms,
  onTermSelect,
  keyInUserObject,
}: UserChipFormProps) => {
  const { t } = useTranslation()

  return (
    <View>
      <HoliText style={styles.subline}>{t(`user.${keyInUserObject}.form.subline`)}</HoliText>

      <HoliTextInput
        accessibilityLabel={t(`profile.${keyInUserObject}.filter.placeholder`)}
        value={filterString}
        placeholder={t(`profile.${keyInUserObject}.filter.placeholder`)}
        onChange={onFilterStringChange}
        trailingIcon="search"
        style={styles.input}
      />

      <HoliChipRow editable={false} editButtonLabel="">
        {terms.map(({ id, selected, title }) => (
          <HoliChip
            key={id}
            checked={selected}
            onPress={() => onTermSelect(id)}
            text={title}
            label={title}
            style={styles.chip}
          />
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
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
})

export default UserChipForm
