import type { ResourceCategory } from '@holi/core/screens/spaces/components/ResourceCategoryTile'

export const SPACE_COLLABORATOR_TOOLS = {
  DIGITAL_TOOL: 'digital-tool',
  STORAGE: 'storage',
  EVENT: 'event',
  POLL: 'poll',
  VIDEO_CALL: 'video-call',
  WALLET: 'wallet',
}

export const RESOURCE_CATEGORIES_LIST: ResourceCategory[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.DIGITAL_TOOL,
    icon: 'link-m',
    translationKey: 'spaces.resources.category.linkhub',
    path: '/linkhub',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.STORAGE,
    icon: 'folder-open',
    translationKey: 'spaces.resources.category.file',
    path: '/storage',
  },
]

export const RESOURCES_COMING_SOON: ResourceCategory[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.EVENT,
    icon: 'calendar-event-line',
    translationKey: 'spaces.resources.category.event',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.POLL,
    icon: 'timer-2-line',
    translationKey: 'spaces.resources.category.poll',
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
