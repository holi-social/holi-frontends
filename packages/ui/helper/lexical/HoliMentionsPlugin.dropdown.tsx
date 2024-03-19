import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import DropdownOption from '@holi/ui/helper/lexical/HoliMentionsPlugin.dropdownOption'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliLexicalMentionsDropdownProps = {
  optionsList: DropdownOption[]
  selectedIndex?: number
  onChooseOption: (i: number, option: DropdownOption) => void
  onMouseEnter?: (i: number, option: DropdownOption) => void
}

const HoliLexicalMentionsDropdown: React.VFC<HoliLexicalMentionsDropdownProps> = ({
  optionsList,
  selectedIndex = 0,
  onChooseOption,
  onMouseEnter = () => null,
}) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

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
      {
        /** FIXME convert to VirtualizedList, FlatList or SectionList */
        optionsList.map((option, i: number) => (
          /* The div is needed for the native onMouseEnter function.
           * onFocus does not work within a Portal
           */
          <div key={`${option.key}-${i}`} tabIndex={i} onMouseEnter={() => onNativeMouseEnter(i, option)}>
            <HoliButton
              label={option.user.fullName}
              transparent
              inline
              onPress={() => onChooseOption(i, option)}
              style={[
                styles.suggestionItem,
                (hightlightedIndex === i || selectedIndex === i) && {
                  backgroundColor: colors.background30,
                },
              ]}
              contentStyle={{ alignItems: 'center', flexDirection: 'row' }}
              testID={'holi-rich-text-input-suggestions-item'}
            >
              <HoliAvatar
                imageSrc={option.user.avatar}
                imageBlurhash={option.user.avatarBlurhash}
                label={option.user.fullName}
                initials={option.user.avatarLabel}
                defaultColor={option.user.avatarDefaultColor}
                size="micro"
                style={{ marginRight: 10 }}
              />
              <HoliText style={{ whiteSpace: 'nowrap' }}>{option.user.fullName}</HoliText>
            </HoliButton>
          </div>
        ))
      }
    </View>
  )
}

export default HoliLexicalMentionsDropdown

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    suggestionsContainer: {
      width: '100%',
      backgroundColor: theme.colors.background10,
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
