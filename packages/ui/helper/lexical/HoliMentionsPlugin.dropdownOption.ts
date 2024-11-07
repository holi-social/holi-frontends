import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import { User } from '@holi/core/domain/shared/types'

class HoliMentionsPluginDropdownOption extends MenuOption {
  user: User

  constructor(user: User) {
    super(user.id)
    this.user = user
  }
}
export default HoliMentionsPluginDropdownOption
