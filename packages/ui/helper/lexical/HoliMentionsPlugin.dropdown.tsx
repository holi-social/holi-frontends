import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import DropdownOption from '@holi/ui/helper/lexical/HoliMentionsPlugin.dropdownOption'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliLexicalMentionsDropdownProps = {
  optionsList: DropdownOption[]
  onClick: (i: number, option: DropdownOption) => void
  onMouseEnter?: (i: number, option: DropdownOption) => void
}

const HoliLexicalMentionsDropdown: React.VFC<HoliLexicalMentionsDropdownProps> = ({
  optionsList,
  onClick,
  onMouseEnter = () => null,
}) => {
  const [hightlightedIndex, setHightlightedIndex] = useState<number>(0)

  const onNativeMouseEnter = useCallback(
    (index: number, option: DropdownOption) => {
      setHightlightedIndex(index)
      onMouseEnter?.(index, option)
    },
    [onMouseEnter, setHightlightedIndex]
  )

  if (optionsList.length < 1) return null

  return (
    <View style={styles.suggestionsContainer}>
      {optionsList.map((option, i: number) => (
        /* The div is needed for the native onMouseEnter function.
         * onFocus does not work within a Portal
         */
        <div key={`${option.key}-${i}`} tabIndex={i} onMouseEnter={() => onNativeMouseEnter(i, option)}>
          <HoliButton
            label={option.user.fullName}
            transparent
            inline
            onPress={() => onClick(i, option)}
            style={[
              styles.suggestionItem,
              hightlightedIndex === i && { backgroundColor: colors.backgroundColorGreyLight },
            ]}
            contentStyle={{ alignItems: 'center', flexDirection: 'row' }}
          >
            <HoliUserAvatar
              imageSrc={option.user.avatar}
              label={option.user.fullName}
              initials={option.user.avatarLabel}
              defaultColor={option.user.avatarDefaultColor}
              size="micro"
              style={{ marginRight: 10 }}
            />
            <HoliText style={{ whiteSpace: 'nowrap' }}>{option.user.fullName}</HoliText>
          </HoliButton>
        </div>
      ))}
    </View>
  )
}

export default HoliLexicalMentionsDropdown

const styles = StyleSheet.create({
  suggestionsContainer: {
    width: '100%',
    backgroundColor: colors.backgroundColor,
  },
  suggestionItem: {
    display: 'flex',
    whiteSpace: 'nowrap',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
  },
})
