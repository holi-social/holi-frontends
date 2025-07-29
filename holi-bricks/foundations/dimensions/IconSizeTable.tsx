import { VerifiedInternal } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { IconSize } from 'holi-bricks/foundations/dimensions/iconSize'
import React from 'react'

export const IconSizeTable = () => {
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Size</th>
          <th>Dimension (px)</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.keys(IconSize)
          .map((size) => size as IconSize)
          .map((size) => (
            <tr key={size}>
              <td>{size}</td>
              <td>{IconSize[size]}</td>
              <td>
                <HoliIcon icon={VerifiedInternal} size={IconSize[size]} />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
