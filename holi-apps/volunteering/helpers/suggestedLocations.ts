import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

type GeolocationSuggestionWithLocalOverride = GeolocationSuggestion & {
  overrideEn?: Partial<GeolocationSuggestion>
}

export const suggestedLocations: GeolocationSuggestionWithLocalOverride[] = [
  {
    id: '51223999b85500244059f052ea9271c64a40f00101f9013ef5000000000000c00208',
    label: 'Hamburg, Deutschland',
    city: 'Hamburg',
    country: 'Deutschland',
    coordinates: {
      latitude: 53.550341,
      longitude: 10.000654,
    },
    overrideEn: {
      label: 'Hamburg, Germany',
      country: 'Germany',
    },
  },
  {
    id: '512c595f6e41cc2a40592c82ffad64414a40f00101f901d6f3000000000000c00208',
    label: 'Berlin, Deutschland',
    city: 'Berlin',
    country: 'Deutschland',
    coordinates: {
      latitude: 52.510885,
      longitude: 13.3989367,
    },
    overrideEn: {
      label: 'Berlin, Germany',
      country: 'Germany',
    },
  },
  {
    id: '51ac66e77e9826274059f9426dc08c114840f00101f901dcf3000000000000c00208',
    label: 'München, BY, Deutschland',
    city: 'München',
    state: 'Bayern',
    country: 'Deutschland',
    coordinates: {
      latitude: 48.1371079,
      longitude: 11.5753822,
    },
    overrideEn: {
      label: 'Munich, BY, Germany',
      city: 'Munich',
      state: 'Bavaria',
      country: 'Germany',
    },
  },
  {
    id: '51337f96f8ed792b4059f5e0496650864940f00101f9019dec020000000000c00208',
    label: 'Dresden, SN, Deutschland',
    city: 'Dresden',
    state: 'Sachsen',
    country: 'Deutschland',
    coordinates: {
      latitude: 51.0493286,
      longitude: 13.7381437,
    },
    overrideEn: {
      label: 'Dresden, SN, Germany',
      state: 'Saxony',
      country: 'Germany',
    },
  },
  {
    id: '513dbf83faf11a1b4059d2ba57f7d99c4940f00101f9014bf4000000000000c00208',
    label: 'Düsseldorf, NW, Deutschland',
    city: 'Düsseldorf',
    state: 'Nordrhein-Westfalen',
    country: 'Deutschland',
    coordinates: {
      latitude: 51.2254018,
      longitude: 6.7763137,
    },
    overrideEn: {
      label: 'Dusseldorf, NW, Germany',
      city: 'Dusseldorf',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
    },
  },
  {
    id: '51706bc14131801e4059ecc8ec8733fb4940f00101f9017ff4000000000000c00208',
    label: 'Münster, NW, Deutschland',
    city: 'Münster',
    state: 'Nordrhein-Westfalen',
    country: 'Deutschland',
    coordinates: {
      latitude: 51.9625101,
      longitude: 7.6251879,
    },
    overrideEn: {
      label: 'Münster, NW, Germany',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
    },
  },
  {
    id: '518d0a9c6c03d71b4059c26b97361c784940f00101f90172f4000000000000c00208',
    label: 'Köln, NW, Deutschland',
    city: 'Köln',
    state: 'Nordrhein-Westfalen',
    country: 'Deutschland',
    coordinates: {
      latitude: 50.938361,
      longitude: 6.959974,
    },
    overrideEn: {
      label: 'Cologne, NW, Germany',
      city: 'Cologne',
      state: 'North Rhine-Westphalia',
      country: 'Germany',
    },
  },
  {
    id: '515b33e83a43ef204059d1dbe918a1be4840f00101f901e3f4000000000000c00208',
    label: 'Mannheim, BW, Deutschland',
    city: 'Mannheim',
    state: 'Baden-Württemberg',
    country: 'Deutschland',
    coordinates: {
      latitude: 49.4892913,
      longitude: 8.4673098,
    },
    overrideEn: {
      label: 'Mannheim, BW, Germany',
      state: 'Baden-Württemberg',
      country: 'Germany',
    },
  },
  {
    id: '5154faaead449d214059aa32e774b4894a40f00101f9015ff4000000000000c00208',
    label: 'Bremen, HB, Deutschland',
    city: 'Bremen',
    state: 'Bremen',
    country: 'Deutschland',
    coordinates: {
      latitude: 53.0758196,
      longitude: 8.8071646,
    },
    overrideEn: {
      label: 'Bremen, HB, Germany',
      country: 'Germany',
    },
  },
  {
    id: '5100bf901f3b5d21405926be7f98290e4940f00103f9012860a20100000000c00208',
    label: 'Frankfurt am Main, HE, Deutschland',
    city: 'Frankfurt am Main',
    state: 'Hessen',
    country: 'Deutschland',
    coordinates: {
      latitude: 50.1106444,
      longitude: 8.6820917,
    },
    overrideEn: {
      label: 'Frankfurt, Hesse, Germany',
      city: 'Frankfurt',
      state: 'Hesse',
      country: 'Germany',
    },
  },
  {
    id: '5171789cfddcbf284059e1bb28d599ab4940f00101f901b9f4000000000000c00208',
    label: 'Leipzig, SN, Deutschland',
    city: 'Leipzig',
    state: 'Sachsen',
    country: 'Deutschland',
    coordinates: {
      latitude: 51.3406321,
      longitude: 12.3747329,
    },
    overrideEn: {
      label: 'Leipzig, SN, Germany',
      state: 'Saxony',
      country: 'Germany',
    },
  },
  {
    id: '514fac53e57bd6294059b39cdf8b8a6a4940f00101f90182f4000000000000c00208',
    label: 'Chemnitz, SN, Deutschland',
    city: 'Chemnitz',
    state: 'Sachsen',
    country: 'Deutschland',
    coordinates: {
      latitude: 50.8323531,
      longitude: 12.918914,
    },
    overrideEn: {
      label: 'Chemnitz, SN, Germany',
      state: 'Saxony',
      country: 'Germany',
    },
  },
  {
    id: '5155b2adb02a5c224059658f5033a4634840f00101f901909e2a0000000000c00208',
    label: 'Stuttgart, BW, Deutschland',
    city: 'Stuttgart',
    state: 'Baden-Württemberg',
    country: 'Deutschland',
    coordinates: {
      latitude: 48.7784485,
      longitude: 9.1800132,
    },
    overrideEn: {
      label: 'Stuttgart, BW, Germany',
      country: 'Germany',
    },
  },
  {
    id: '51a9177c9a9327264059f9484a7a18ba4840f00101f9013cf5000000000000c00208',
    label: 'Nürnberg, BY, Deutschland',
    city: 'Nürnberg',
    state: 'Bayern',
    country: 'Deutschland',
    coordinates: {
      latitude: 49.453872,
      longitude: 11.077298,
    },
    overrideEn: {
      label: 'Nuremberg, BY, Germany',
      city: 'Nuremberg',
      state: 'Bavaria',
      country: 'Germany',
    },
  },
]
