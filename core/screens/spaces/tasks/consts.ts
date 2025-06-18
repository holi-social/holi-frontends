import { InteractionType, LocationType, Regularity, VisibilityType } from '@holi/api/graphql/graphql-codegen'
import { ChatSmile2, Global, LinkM, Lock, StreakFilled } from '@holi/icons/src/generated'
import type { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'

export const VISIBILITY_TYPE_OPTIONS: HoliModalSelectOption<VisibilityType>[] = [
  {
    id: VisibilityType.Public,
    title: 'Public',
    selected: false,
    icon: Global,
  },
  {
    id: VisibilityType.Members,
    title: 'Members',
    selected: false,
    icon: Lock,
  },
]

export const SPACE_POST_VISIBILITY_TYPE_OPTIONS: HoliModalSelectOption<VisibilityType>[] = [
  {
    id: VisibilityType.Members,
    title: 'Members',
    selected: false,
    disabled: false,
    icon: Lock,
  },
  {
    id: VisibilityType.Public,
    title: 'Public',
    selected: false,
    disabled: false,
    icon: Global,
  },
]

export const LOCATION_TYPE_OPTIONS: HoliModalSelectOption<LocationType>[] = [
  {
    id: LocationType.Onsite,
    title: 'On-site',
    selected: false,
  },
  {
    id: LocationType.Remote,
    title: 'Remote',
    selected: false,
  },
  {
    id: LocationType.Hybrid,
    title: 'Hybrid',
    selected: false,
  },
]

export const INTERACTION_TYPE_OPTIONS: HoliModalSelectOption<InteractionType>[] = [
  {
    id: InteractionType.Chat,
    title: 'Chat',
    selected: false,
    icon: ChatSmile2,
  },
  {
    id: InteractionType.Link,
    title: 'Link',
    selected: false,
    icon: LinkM,
  },
  {
    id: InteractionType.Ready,
    title: 'Ready',
    selected: false,
    icon: StreakFilled,
  },
]

export const REGULARITY_OPTIONS: HoliModalSelectOption<Regularity>[] = [
  {
    id: Regularity.OneTime,
    title: 'OneTime',
    selected: false,
  },
  {
    id: Regularity.OnceWeek,
    title: 'OnceWeek',
    selected: false,
  },
  {
    id: Regularity.SeveralTimesWeek,
    title: 'SeveralTimesWeek',
    selected: false,
  },
  {
    id: Regularity.OnceMonth,
    title: 'OnceMonth',
    selected: false,
  },
  {
    id: Regularity.Negotiable,
    title: 'Negotiable',
    selected: false,
  },
]
