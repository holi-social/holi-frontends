import { Platform } from 'react-native'

import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import type { HoliApp } from '@holi/core/screens/appsHub/components/AppTile'
import { HandHeartFilled, HeartsFilled, StarSmileFilled } from '@holi/icons/src/generated'

export const HOLI_APPS = {
  DONATIONS: 'donations',
  GOOD_NEWS: 'goodnews',
  VOLUNTEERING: 'volunteering',
  CHALLENGES: 'challenges',
  COMING_SOON: 'coming-soon',
}

export const HOLI_APPS_NAVIGATION_PATHS = {
  [HOLI_APPS.DONATIONS]: {
    path: '/apps/donations',
  },
  [HOLI_APPS.GOOD_NEWS]: {
    path: '/apps/goodnews',
  },
  [HOLI_APPS.VOLUNTEERING]: {
    path: '/apps/volunteering',
  },
  [HOLI_APPS.CHALLENGES]: {
    path: '/apps/challenges',
  },
}

export const APP_SWIPER_APPS: HoliApp[] = [
  {
    id: HOLI_APPS.CHALLENGES,
    icon: StarSmileFilled,
    translationKey: 'challenges:app.name',
    featureToggleName: FeatureToggleName.CHALLENGES,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.CHALLENGES].path,
    hasUpdates: true,
    active: Platform.OS !== 'web',
  },
  {
    id: HOLI_APPS.DONATIONS,
    icon: HandHeartFilled,
    translationKey: 'donations:app.name',
    featureToggleName: FeatureToggleName.APPS_DONATIONS,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.DONATIONS].path,
    hasUpdates: false,
    active: true,
  },
  {
    id: HOLI_APPS.VOLUNTEERING,
    icon: HeartsFilled,
    translationKey: 'volunteering:app.name',
    featureToggleName: FeatureToggleName.APPS_VOLUNTEERING,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path,
    hasUpdates: true,
    active: true,
  },
]
