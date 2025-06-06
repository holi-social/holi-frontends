import type { InfoModalItemProps } from '@holi/core/components/InfoModal'
import type { DetailsScreenData } from '@holi/core/layout/DetailsScreen'

export type VolunteeringDetailsScreenData = DetailsScreenData & {
  externalUrl?: string
  commitmentType?: string
  locationType?: string
  source?: string
}

export const VOLUNTEERING_IMG_SOURCES_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  Voltastics: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/voltastics-logo.png'),
      isSvg: false,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/voltastics-wordmark.png'),
      width: 159,
      height: 24,
      isSvg: false,
    },
    url: 'https://voltastics.com/',
  },
  'Aktion Mensch': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/aktion-mensch-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/aktion-mensch-wordmark.svg'),
      width: 60,
      height: 24,
      isSvg: true,
    },
    url: 'https://aktion-mensch.de/ueber-uns/die-aktion-mensch',
  },
  'vostel.de': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/vostel-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/vostel-wordmark.svg'),
      width: 71,
      height: 24,
      isSvg: true,
    },
    url: 'https://vostel.de/de/ueber_vostel',
  },
  GoNature: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/gonature-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/gonature-wordmark.svg'),
      width: 76,
      height: 24,
      isSvg: true,
    },
    url: 'https://gonature.de/ueber-uns',
  },
  GoVolunteer: {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/govolunteer-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/govolunteer-wordmark.svg'),
      width: 119,
      height: 24,
      isSvg: true,
    },
    url: 'https://govolunteer.com/ueber-uns',
  },
  'German Volunteers': {
    logo: {
      src: require('@holi/ui/assets/img/volunteering/german-volunteers-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/volunteering/german-volunteers-wordmark.svg'),
      width: 46,
      height: 24,
      isSvg: true,
    },
    url: 'https://germanvolunteers.de/uber-uns',
  },
}
