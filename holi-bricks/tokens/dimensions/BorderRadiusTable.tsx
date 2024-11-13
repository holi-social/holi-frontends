import { Colors } from 'holi-bricks/tokens/colors/primitives'
import { BorderRadius } from 'holi-bricks/tokens/dimensions/borderRadius'
import { Spacing } from 'holi-bricks/tokens/dimensions/spacing'
import React from 'react'

export const BorderRadiusTable = () => {
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
        {Object.keys(BorderRadius)
          .map((size) => size as BorderRadius)
          .map((size) => (
            <tr key={size}>
              <td>{size}</td>
              <td>{BorderRadius[size]}</td>
              <td>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: Colors.purple,
                    width: Spacing['4xl'],
                    height: Spacing['lg'],
                    borderRadius: BorderRadius[size],
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
