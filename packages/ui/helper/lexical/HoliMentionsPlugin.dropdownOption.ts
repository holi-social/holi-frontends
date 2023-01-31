import { TypeaheadOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import type { User } from '@holi/core/screens/userprofile/types'

class HoliMentionsPluginDropdownOption extends TypeaheadOption {
  user: User

  constructor(user: User) {
    super(user.id)
    this.user = user
  }
}
export default HoliMentionsPluginDropdownOption
