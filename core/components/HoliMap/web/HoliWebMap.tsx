'use client'

import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet/dist/leaflet.css'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer } from 'react-leaflet'

import { MapProps } from '@holi/core/components/HoliMap/types'

const HoliWebMap = (props: PropsWithChildren<MapProps>) => {
  const { t } = useTranslation()
  const attributionPrefix = t('spaces.spaceDetails.map.footer')

  return (
    <MapContainer
      /* random key - reinitialize the map on every rerender
       * this helps fix a layout issue which occurs because the map is initializing its viewport
       * while the surrounding react component layout isn't done sorting its layout out
       * so the map has a wrong understanding of its layout
       * which leads to the pin not being centered and the tiles not filling the whole viewport
       * */
      key={Math.random()}
      center={{ lat: props.center.latitude, lng: props.center.longitude }}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution={`${attributionPrefix} <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`}
        url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
      />
      {props.children}
    </MapContainer>
  )
}
export default HoliWebMap
