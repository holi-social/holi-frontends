import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'

class HoliMentionsPluginDropdownOption extends TypeaheadOption {
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
export default HoliMentionsPluginDropdownOption
