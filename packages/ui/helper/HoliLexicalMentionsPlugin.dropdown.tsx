import * as React from 'react'
import { StyleSheet } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

import DropdownOption from './HoliLexicalMentionsPlugin.dropdownOption'

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
          key={option.key}
          tabIndex={-1}
          className={`item ${props.selectedIndex === i && 'selected'}`}
          ref={option.setRefElement}
          role="option"
          aria-selected={props.selectedIndex === i}
          id={'typeahead-item-' + i}
          onMouseEnter={() => props.onMouseEnter(i, option)}
          onClick={() => props.onClick(i, option)}
          style={styles.suggestionItem}
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
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
    borderStyle: 'solid',
  },
  suggestionItem: {
    whiteSpace: 'nowrap',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColorGrey,
    borderBottomStyle: 'solid',
  },
})
