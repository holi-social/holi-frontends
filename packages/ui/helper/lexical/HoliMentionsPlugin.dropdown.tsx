import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import DropdownOption from '@holi/ui/helper/lexical/HoliMentionsPlugin.dropdownOption'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliLexicalMentionsDropdownProps = {
  optionslist: DropdownOption[]
  selectedIndex: number
  onClick: (i: number, option: DropdownOption) => void
  onMouseEnter: (i: number, option: DropdownOption) => void
}

const HoliLexicalMentionsDropdown: React.VFC<HoliLexicalMentionsDropdownProps> = (
  props: HoliLexicalMentionsDropdownProps
) => {
  return (
    <View style={styles.suggestionsContainer}>
      {props.optionslist.map((option, i: number) => (
        <HoliButton
          key={`${option.key}-${i}`}
          label={option.user.fullName}
          transparent
          inline
          onFocus={() => props.onMouseEnter(i, option)}
          onPress={() => props.onClick(i, option)}
          testID={'typeahead-item-' + i}
          style={[
            styles.suggestionItem,
            props.selectedIndex === i && { backgroundColor: colors.backgroundColorGreyLight },
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
      ))}
    </View>
  )
}

export default HoliLexicalMentionsDropdown

const styles = StyleSheet.create({
  suggestionsContainer: {
    display: 'inline-block',
    marginTop: 25,
    backgroundColor: colors.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: colors.borderColorGrey,
    borderTopStyle: 'solid',
    borderRadius: 10,
    padding: 5,
    boxShadow: `0px 0px 16px ${colors.backgroundColorOverlay}`,
  },
  suggestionItem: {
    display: 'flex',
    whiteSpace: 'nowrap',
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
  },
})
