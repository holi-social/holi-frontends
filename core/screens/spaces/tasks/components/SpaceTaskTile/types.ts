import type { Space, Task } from '@holi/api/graphql/graphql-codegen'

export interface BaseProps {
  task: Task
  space: Pick<Space, 'id' | 'name' | 'title' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor'>
}

export interface ListProps extends BaseProps {
  isCollaborator?: boolean
}
