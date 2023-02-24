import type { ResourceCateogry } from '@holi/core/screens/spaces/components/ResourceCategoryTile'

export const SPACE_COLLABORATOR_TOOLS = {
  DIGITAL_TOOL: 'digital-tool',
  FILE: 'file',
  EVENT: 'event',
  DATE_PICKER: 'date-picker',
  VIDEO_CALL: 'video-call',
  WALLET: 'wallet',
}

export const RESOURCE_CATEGORIES_LIST: ResourceCateogry[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.DIGITAL_TOOL,
    icon: 'link-m',
    translationKey: 'spaces.resources.category.digitalTool',
    path: 'digital-tool',
  },
]

export const RESOURCES_COMING_SOON: ResourceCateogry[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.EVENT,
    icon: 'calendar-event-line',
    translationKey: 'spaces.resources.category.event',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.DATE_PICKER,
    icon: 'timer-2-line',
    translationKey: 'spaces.resources.category.datePicker',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.VIDEO_CALL,
    icon: 'group-line',
    translationKey: 'spaces.resources.category.videoCall',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.WALLET,
    icon: 'wallet-3-line',
    translationKey: 'spaces.resources.category.wallet',
    path: '',
  },
]
