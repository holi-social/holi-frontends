import type { ResourceCateogry } from '@holi/core/screens/spaces/components/ResourceCategoryTile'

export const SPACE_COLLABORATOR_TOOLS = {
  DIGITAL_TOOL: 'digital-tool',
  FILE: 'file',
  EVENT: 'event',
  DATE_PICKER: 'date-picker',
  VIDEO_CALL: 'video-call',
  WALLET: 'wallet',
}

export const ADD_NEW_RESOURCES: ResourceCateogry[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.DIGITAL_TOOL,
    icon: 'image',
    translationKey: 'spaces.resources.category.digitalTool',
    path: 'digital-tool',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.FILE,
    icon: 'newspaper',
    translationKey: 'spaces.resources.category.file',
    path: 'file',
  },
]

export const RESOURCES_COMING_SOON: ResourceCateogry[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.EVENT,
    icon: 'image',
    translationKey: 'spaces.resources.category.event',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.DATE_PICKER,
    icon: 'newspaper',
    translationKey: 'spaces.resources.category.datePicker',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.VIDEO_CALL,
    icon: 'newspaper',
    translationKey: 'spaces.resources.category.videoCall',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.WALLET,
    icon: 'newspaper',
    translationKey: 'spaces.resources.category.wallet',
    path: '',
  },
]
