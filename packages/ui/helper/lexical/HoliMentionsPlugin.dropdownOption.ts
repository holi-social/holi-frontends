import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import { User } from '@holi/core/domain/shared/types'

class HoliMentionsPluginDropdownOption extends TypeaheadOption {
  user: User

  constructor(user: User) {
    super(user.id)
    this.user = user
  }
}
export default HoliMentionsPluginDropdownOption
