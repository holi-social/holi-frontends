import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import type { ResourceCategory } from '@holi/core/screens/spaces/details/components/ResourceCategoryTile'
import { CalendarEvent, CheckboxFilled, FolderOpenFilled, LinkM, VidiconFilled } from '@holi/icons/src/generated'

export const SPACE_COLLABORATOR_TOOLS = {
  DIGITAL_TOOL: 'digital-tool',
  STORAGE: 'storage',
  EVENT: 'event',
  POLL: 'poll',
  VIDEO_CALL: 'video-call',
  WALLET: 'wallet',
  TASKS: 'tasks',
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
    icon: FolderOpenFilled,
    translationKey: 'spaces.resources.category.file',
    featureToggleName: FeatureToggleName.STORAGE,
    path: '/storage',
  },

  {
    id: SPACE_COLLABORATOR_TOOLS.TASKS,
    icon: CheckboxFilled,
    translationKey: 'spaces.resources.category.tasks',
    path: '/tasks',
  },

  {
    id: SPACE_COLLABORATOR_TOOLS.VIDEO_CALL,
    icon: VidiconFilled,
    translationKey: 'spaces.resources.category.videoCall',
    featureToggleName: FeatureToggleName.VIDEOCALL,
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
]
