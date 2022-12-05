import * as React from 'react'
import { StyleSheet } from 'react-native'

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
    <ul style={styles.suggestionsContainer}>
      {props.optionslist.map((option, i: number) => (
        <li
          key={`${option.key}-${i}`}
          tabIndex={-1}
          className={`item ${props.selectedIndex === i && 'selected'}`}
          ref={option.setRefElement}
          role="option"
          aria-selected={props.selectedIndex === i}
          id={'typeahead-item-' + i}
          onMouseEnter={() => props.onMouseEnter(i, option)}
          onClick={() => props.onClick(i, option)}
          style={{
            ...StyleSheet.flatten(styles.suggestionItem),
            ...(props.selectedIndex === i && { backgroundColor: colors.backgroundColorGreyLight }),
          }}
        >
          {option.picture}
          <span className="text">{option.name}</span>
        </li>
      ))}
    </ul>
  )
}

export default HoliLexicalMentionsDropdown

const styles = StyleSheet.create({
  suggestionsContainer: {
    display: 'inline-block',
    backgroundColor: colors.backgroundColor,
    marginTop: 25,
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
