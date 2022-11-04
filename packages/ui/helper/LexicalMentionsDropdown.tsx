import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import React from 'react'
import 'react-native'

export class MentionTypeaheadOption extends TypeaheadOption {
  name: string
  picture: JSX.Element

  constructor(name: string, picture: JSX.Element) {
    super(name)
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
    <div className="typeahead-popover mentions-menu">
      <ul>
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
            style={{
              backgroundColor: 'white',
              whiteSpace: 'nowrap',
              borderWidth: 1,
              borderColor: 'green',
              borderStyle: 'solid',
              display: 'inline-block',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            {option.picture}
            <span className="text">{option.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LexicalMentionsDropdown
