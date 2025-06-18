import type { CreateTaskInput } from '@holi/api/graphql/graphql-codegen'

export interface TaskFormInput
  extends Omit<CreateTaskInput, 'spaceId' | 'taskId' | 'visibility' | 'locationType' | 'regularity'> {
  visibility?: CreateTaskInput['visibility']
  locationType?: CreateTaskInput['locationType']
  regularity?: CreateTaskInput['regularity']
}
