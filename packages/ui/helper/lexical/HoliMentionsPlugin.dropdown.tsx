import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import type DropdownOption from '@holi/ui/helper/lexical/HoliMentionsPlugin.dropdownOption'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { Spacing } from 'holi-bricks/tokens'

export type HoliLexicalMentionsDropdownProps = {
  optionsList: DropdownOption[]
  selectedIndex?: number
  onChooseOption: (i: number, option: DropdownOption) => void
  onMouseEnter?: (i: number, option: DropdownOption) => void
}

const HoliLexicalMentionsDropdown: React.FC<HoliLexicalMentionsDropdownProps> = ({
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
              <View style={styles.suggestionText}>
                <Avatar
                  imgSrc={option.user.avatar}
                  imgPlaceholder={option.user.avatarBlurhash}
                  label={option.user.fullName}
                  initials={option.user.avatarLabel}
                  size="xs"
                />
                <HoliText style={{ whiteSpace: 'nowrap' }}>{option.user.fullName}</HoliText>
              </View>
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
    suggestionText: {
      flexDirection: 'row',
      gap: Spacing['3xs'],
    },
    suggestionItem: {
      display: 'flex',
      width: '100%',
      whiteSpace: 'nowrap',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 7,
      paddingBottom: 7,
    },
  })
