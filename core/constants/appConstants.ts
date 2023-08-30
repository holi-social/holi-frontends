import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import type { HoliApp } from '@holi/core/screens/homeFeed/components/AppTile'
import { AppsSoonFilled, HandHeartFilled, HeartsFilled, NewspaperFilled } from '@holi/icons/src/generated'

export const HOLI_APPS = {
  DONATIONS: 'donations',
  GOOD_NEWS: 'goodnews',
  VOLUNTEERING: 'volunteering',
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
}

export const APP_SWIPER_APPS: HoliApp[] = [
  {
    id: HOLI_APPS.DONATIONS,
    icon: HandHeartFilled,
    translationKey: 'donations:app.name',
    featureToggleName: FeatureToggleName.APPS_DONATIONS,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.DONATIONS].path,
    hasUpdates: false,
  },
  {
    id: HOLI_APPS.GOOD_NEWS,
    icon: NewspaperFilled,
    translationKey: 'goodnews:app.name',
    featureToggleName: FeatureToggleName.APPS_GOODNEWS,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.GOOD_NEWS].path,
    hasUpdates: true,
  },
  {
    id: HOLI_APPS.VOLUNTEERING,
    icon: HeartsFilled,
    translationKey: 'volunteering:app.name',
    featureToggleName: FeatureToggleName.APPS_VOLUNTEERING,
    path: HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path,
    hasUpdates: true,
  },
  {
    id: HOLI_APPS.COMING_SOON,
    icon: AppsSoonFilled,
    translationKey: 'global.comingSoon',
    hasUpdates: false,
  },
]
