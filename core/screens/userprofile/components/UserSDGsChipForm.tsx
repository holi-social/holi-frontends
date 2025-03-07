import { ChipSelect } from 'holi-bricks/components/chips'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { SDG } from '@holi/core/domain/shared/types'
import { Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import type { ChipSelectSize } from 'holi-bricks/components/chips/size'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'

export interface SelectableSDG extends SDG {
  selected?: boolean
}

type UserSDGsChipFormProps = {
  filterString?: string
  onFilterStringChange: (value: string) => void
  terms: SelectableSDG[]
  onTermSelect: (id: string) => void
  loading?: boolean
  size?: ChipSelectSize
  testID?: string
}

export const UserSDGsChipForm = ({
  filterString,
  onFilterStringChange,
  terms,
  onTermSelect,
  loading = false,
  size = 'md',
  testID = 'user-chip-form',
}: UserSDGsChipFormProps) => {
  const { t } = useTranslation()
  const keyInUserObject = UserChipTypes.SDGS

  return (
    <View testID={testID}>
      <HoliText style={styles.subline}>{t(`user.${keyInUserObject}.form.subline`)}</HoliText>

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
            {terms.map(({ id, selected, title, slug }) => (
              <ChipSelect
                key={id}
                onPress={() => onTermSelect(id)}
                selected={selected}
                selectedColor={'green'}
                size={size}
                testID={`${testID}--${slug}-chip`}
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
