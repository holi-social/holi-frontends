import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'

class HoliLexicalMentionsPluginDropdownOption extends TypeaheadOption {
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
export default HoliLexicalMentionsPluginDropdownOption
