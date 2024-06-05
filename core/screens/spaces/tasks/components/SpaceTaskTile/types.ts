import { Space, Task } from '@holi/core/screens/spaces/types'

export interface BaseProps {
  task: Task
  space: Space
}

export interface ListProps extends BaseProps {
  isCollaborator?: boolean
}
