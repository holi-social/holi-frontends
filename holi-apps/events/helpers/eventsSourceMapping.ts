import type { InfoModalItemProps } from '@holi/core/components/InfoModal'

export const EVENTS_SOURCE_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  'Gemeinschaftswerk Nachhaltigkeit': {
    text: 'Gemeinschaftswerk Nachhaltigkeit',
    logo: {
      src: require('@holi/ui/assets/img/events/gemeinschaftswerk-nachhaltigkeit-logo.svg'),
      isSvg: true,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/events/gemeinschaftswerk-nachhaltigkeit-wordmark.png'),
      width: 119,
      height: 34,
      isSvg: false,
    },
    url: 'https://gemeinschaftswerk-nachhaltigkeit.de',
  },
}
