import { LocationType, Regularity, VisibilityType } from '@holi/core/screens/spaces/types'
import { Global, Lock } from '@holi/icons/src/generated'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'

export const VISIBILITY_TYPE_OPTIONS: HoliModalSelectOption[] = [
  {
    id: VisibilityType.PUBLIC,
    title: 'Public',
    selected: false,
    icon: Global,
  },
  {
    id: VisibilityType.MEMBERS,
    title: 'Members',
    selected: false,
    icon: Lock,
  },
]

export const SPACE_POST_VISIBILITY_TYPE_OPTIONS: HoliModalSelectOption<VisibilityType>[] = [
  {
    id: VisibilityType.MEMBERS,
    title: 'Members',
    selected: false,
    disabled: false,
    icon: Lock,
  },
  {
    id: VisibilityType.PUBLIC,
    title: 'Public',
    selected: false,
    disabled: false,
    icon: Global,
  },
]

export const LOCATION_TYPE_OPTIONS: HoliModalSelectOption[] = [
  {
    id: LocationType.ONSITE,
    title: 'On-site',
    selected: false,
  },
  {
    id: LocationType.REMOTE,
    title: 'Remote',
    selected: false,
  },
  {
    id: LocationType.HYBRID,
    title: 'Hybrid',
    selected: false,
  },
]

export const REGULARITY_OPTIONS: HoliModalSelectOption[] = [
  {
    id: Regularity.ONE_TIME,
    title: 'One time',
    selected: false,
  },
  {
    id: Regularity.PROJECT_BASED,
    title: 'Project based',
    selected: false,
  },
  {
    id: Regularity.REGULARLY,
    title: 'Regularly',
    selected: false,
  },
]
