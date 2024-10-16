import React from 'react'

import { BorderRadius, BorderRadiusSize } from '@holi/ui/foundations/BorderRadius'
import Spacing from '@holi/ui/foundations/Spacing'
import theme from '@holi/ui/no-name/foundations/colors/themes/dark'

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
        {Object.keys(BorderRadius)
          .map((size) => size as BorderRadiusSize)
          .map((size) => (
            <tr key={size}>
              <td>{size}</td>
              <td>{BorderRadius[size]}</td>
              <td>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: theme.colors.background,
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
