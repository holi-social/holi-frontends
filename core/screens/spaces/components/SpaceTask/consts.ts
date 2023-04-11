import { LocationType, Regularity, VisibilityType } from '@holi/core/screens/spaces/types'
import { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'

export const VISIBILITY_TYPE_OPTIONS: HoliModalSelectOption[] = [
  {
    id: VisibilityType.PUBLIC,
    title: 'Public',
    selected: false,
    icon: 'global',
  },
  {
    id: VisibilityType.MEMBERS,
    title: 'Members',
    selected: false,
    icon: 'lock',
  },
]

export const LOCATION_TYPE_OPTIONS: HoliSelectOption[] = [
  {
    id: LocationType.HYBRID,
    title: 'Hybrid',
    selected: false,
  },
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
]

export const REGULARITY_OPTIONS: HoliSelectOption[] = [
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
