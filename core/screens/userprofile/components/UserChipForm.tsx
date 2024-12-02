import { ChipSelect } from 'holi-bricks/components/chips'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { Term } from '@holi/core/domain/shared/types'
import { Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import type { Color } from 'holi-bricks/tokens'
import type { ChipSelectSize } from 'holi-bricks/components/chips/size'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

export interface SelectableTerm extends Term {
  selected?: boolean
}

type UserChipFormProps = {
  keyInUserObject: string
  filterString?: string
  onFilterStringChange: (value: string) => void
  terms: SelectableTerm[]
  onTermSelect: (id: string) => void
  loading?: boolean
  color?: Color
  size?: ChipSelectSize
  testID?: string
}

const UserChipForm: React.VoidFunctionComponent<UserChipFormProps> = ({
  filterString,
  onFilterStringChange,
  terms,
  onTermSelect,
  keyInUserObject,
  loading = false,
  color = 'green',
  size = 'md',
  testID = 'user-chip-form',
}: UserChipFormProps) => {
  const { t } = useTranslation()

  return (
    <View testID={testID}>
      <HoliText style={styles.subline}>{t(`onboarding.${keyInUserObject}.subline`)}</HoliText>

      <HoliTextInput
        aria-label={t(`onboarding.${keyInUserObject}.inputPlaceholder`)}
        value={filterString}
        placeholder={t(`onboarding.${keyInUserObject}.inputPlaceholder`)}
        onChange={onFilterStringChange}
        trailingIcon={Search}
        style={styles.input}
        testID={`${testID}-search-input`}
      />

      <HoliTransition.FadeSwitch animKey={loading ? 'loader' : 'chips'}>
        {loading ? (
          <HoliLoader testID={`${testID}-loader`} />
        ) : terms.length > 0 ? (
          <HoliChipRow editable={false} editButtonLabel="">
            {terms.map(({ id, selected, title }) => (
              <ChipSelect
                key={id}
                onPress={() => onTermSelect(id)}
                selected={selected}
                selectedColor={color}
                size={size}
                testID={`${testID}--${id}-chip`}
              >
                {title}
              </ChipSelect>
            ))}
          </HoliChipRow>
        ) : (
          <HoliText style={styles.subline}>{t(`profile.${keyInUserObject}.filter.empty`)}</HoliText>
        )}
      </HoliTransition.FadeSwitch>
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
