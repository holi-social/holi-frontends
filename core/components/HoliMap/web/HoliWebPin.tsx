'use client'

import L from 'leaflet'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet/dist/leaflet.css'
import React, { PropsWithChildren } from 'react'
import { Marker } from 'react-leaflet'

import { PinProps } from '@holi/core/components/HoliMap/types'

const PinIcon = new L.DivIcon({
  html: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
           <circle opacity="0.32" cx="40" cy="40" r="39" fill="#8B95FF" stroke="#6267E7" stroke-width="2" />
           <circle cx="40" cy="40" r="9" fill="#6267E7" stroke="white" stroke-width="2" />
         </svg>`,
  className: '',
  iconSize: [80, 80],
  iconAnchor: [40, 40],
})

const HoliWebPin = (props: PropsWithChildren<PinProps>) => (
  <Marker position={{ lat: props.location.latitude, lng: props.location.longitude }} icon={PinIcon} {...props} />
)
export default HoliWebPin
