'use client'

import L from 'leaflet'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet/dist/leaflet.css'
import React, { PropsWithChildren } from 'react'
import { Marker } from 'react-leaflet'

import { PinProps } from '@holi/core/components/HoliMap/types'

const PinIcon = new L.DivIcon({
  html: `<svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M20.4853 21.152L12 29.6373L3.51467 21.152C1.83646 19.4737 0.693582 17.3355 0.230571 15.0078C-0.232439 12.68 0.00520913 10.2672 0.913465 8.07451C1.82172 5.88181 3.35979 4.00767 5.33318 2.6891C7.30656 1.37053 9.62663 0.666748 12 0.666748C14.3734 0.666748 16.6934 1.37053 18.6668 2.6891C20.6402 4.00767 22.1783 5.88181 23.0865 8.07451C23.9948 10.2672 24.2324 12.68 23.7694 15.0078C23.3064 17.3355 22.1636 19.4737 20.4853 21.152ZM12 15.3333C12.7072 15.3333 13.3855 15.0524 13.8856 14.5523C14.3857 14.0522 14.6667 13.3739 14.6667 12.6666C14.6667 11.9594 14.3857 11.2811 13.8856 10.781C13.3855 10.2809 12.7072 9.99998 12 9.99998C11.2928 9.99998 10.6145 10.2809 10.1144 10.781C9.61429 11.2811 9.33334 11.9594 9.33334 12.6666C9.33334 13.3739 9.61429 14.0522 10.1144 14.5523C10.6145 15.0524 11.2928 15.3333 12 15.3333Z"
    fill="#5B60D6" />
</svg>
      `,
  className: '',
  iconSize: [24, 30],
  iconAnchor: [12, 30],
})

const HoliWebPin = (props: PropsWithChildren<PinProps>) => (
  <Marker position={{ lat: props.location.latitude, lng: props.location.longitude }} icon={PinIcon} {...props} />
)
export default HoliWebPin
