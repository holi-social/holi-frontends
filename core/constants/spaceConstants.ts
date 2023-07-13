import type { ResourceCategory } from '@holi/core/screens/spaces/details/components/ResourceCategoryTile'
import { CalendarEvent, FolderOpen, Group, LinkM, Timer2, Vidicon, Wallet3 } from '@holi/icons/src/generated'

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
    icon: LinkM,
    translationKey: 'spaces.resources.category.linkhub',
    path: '/linkhub',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.STORAGE,
    icon: FolderOpen,
    translationKey: 'spaces.resources.category.file',
    path: '/storage',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.VIDEO_CALL,
    icon: Vidicon,
    translationKey: 'spaces.resources.category.videoCall',
    path: '/video-call',
  },
]

export const RESOURCES_COMING_SOON: ResourceCategory[] = [
  {
    id: SPACE_COLLABORATOR_TOOLS.EVENT,
    icon: CalendarEvent,
    translationKey: 'spaces.resources.category.event',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.POLL,
    icon: Timer2,
    translationKey: 'spaces.resources.category.poll',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.VIDEO_CALL,
    icon: Group,
    translationKey: 'spaces.resources.category.videoCall',
    path: '',
  },
  {
    id: SPACE_COLLABORATOR_TOOLS.WALLET,
    icon: Wallet3,
    translationKey: 'spaces.resources.category.wallet',
    path: '',
  },
]
