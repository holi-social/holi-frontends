import React from 'react'

import Spacing, { SpacingSize } from '@holi/ui/foundations/Spacing'
import { colors } from '@holi/ui/styles/globalVars'

const SpacingsTable = () => (
  <table style={{ width: '100%' }}>
    <thead>
      <tr>
        <th>Size</th>
        <th>Dimension (px)</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {Object.keys(Spacing)
        .map((size) => size as SpacingSize)
        .map((size) => (
          <tr key={size}>
            <td>{size}</td>
            <td>{Spacing[size]}</td>
            <td>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: colors.error200,
                  width: Spacing[size],
                  height: Spacing[size],
                }}
              />
            </td>
          </tr>
        ))}
    </tbody>
  </table>
)

export default SpacingsTable
