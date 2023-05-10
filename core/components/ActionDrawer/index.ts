import * as Delete from './Delete'
import * as Drawer from './Drawer'
import * as Edit from './Edit'
import * as Report from './Report'
import * as Share from './Share'

const ActionDrawer = {
  ...Delete,
  ...Drawer,
  ...Edit,
  ...Report,
  ...Share,
}

export default ActionDrawer
