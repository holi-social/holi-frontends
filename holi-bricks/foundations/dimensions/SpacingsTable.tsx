import { Colors } from 'holi-bricks/foundations/colors/primitives'
import { Spacing, type SpacingSize } from 'holi-bricks/foundations/dimensions/spacing'
import React from 'react'

export const SpacingsTable = () => {
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
                    backgroundColor: Colors.red,
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
}
