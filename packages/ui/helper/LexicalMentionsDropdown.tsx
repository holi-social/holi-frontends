import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import * as React from 'react'
import { StyleSheet } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export class MentionTypeaheadOption extends TypeaheadOption {
  id: string
  name: string
  picture: JSX.Element

  constructor(id: string, name: string, picture: JSX.Element) {
    super(name)
    this.id = id
    this.name = name
    this.picture = picture
  }
}

export type LexicalMentionsDropdownProps = {
  optionslist: MentionTypeaheadOption[]
  selectedIndex: number
  onClick: (i: number, option: MentionTypeaheadOption) => void
  onMouseEnter: (i: number, option: MentionTypeaheadOption) => void
}
const LexicalMentionsDropdown: React.VFC<LexicalMentionsDropdownProps> = (props: LexicalMentionsDropdownProps) => {
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

export default LexicalMentionsDropdown

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
