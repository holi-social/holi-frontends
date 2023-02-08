/* eslint-disable prettier/prettier */
import React from 'react'

import { colors } from '@holi/ui/styles/globalVars'

const allColors = [
  {
    familyName: 'Foreground',
    colors: [
      { name: '$forground30', code: colors.foreground30, description: 'Headline, links, button borders' },
      { name: '$forground20', code: colors.foreground20, description: 'Support text, body' },
      { name: '$forground10', code: colors.foreground10, description: 'Disabled text, details' },
    ],
  },
  {
    familyName: 'Background',
    colors: [
      { name: '$background30', code: colors.background30, description: 'Background details: input borders, button borders' },
      { name: '$background20', code: colors.background20, description: 'Large areas: pages, main divs' },
      { name: '$background10', code: colors.background10, description: 'Small areas: buttons, pills, tags, cells' },
    ],
  },
  {
    familyName: 'Brand A',
    colors: [
      { name: '$brandColorA30', code: colors.brandColorA30, description: 'Contrasted yellow' },
      { name: '$brandColorA30', code: colors.brandColorA20, description: 'Main yellow, CTAs, buttons' },
      { name: '$brandColorA30', code: colors.brandColorA10, description: 'Soft yellow' },
    ],
  },
  {
    familyName: 'Brand B',
    colors: [
      { name: '$brandColorB30', code: colors.brandColorB30, description: 'Contrasted purple' },
      { name: '$brandColorB30', code: colors.brandColorB20, description: 'Main purple, actions' },
      { name: '$brandColorB30', code: colors.brandColorB10, description: 'Soft purple' },
    ],
  },
  {
    familyName: 'Brand C',
    colors: [
      { name: '$brandColorC30', code: colors.brandColorC30, description: 'Contrasted green' },
      { name: '$brandColorC30', code: colors.brandColorC20, description: 'Main green, pills' },
      { name: '$brandColorC30', code: colors.brandColorC10, description: 'Soft green' },
    ],
  },
  {
    familyName: 'Brand D',
    colors: [
      { name: '$brandColorC30', code: colors.brandColorC30, description: 'Contrasted blue' },
      { name: '$brandColorC30', code: colors.brandColorC20, description: 'Main blue, pills' },
      { name: '$brandColorC30', code: colors.brandColorC10, description: 'Soft blue' },
    ],
  },
  {
    familyName: 'Warning',
    colors: [
      { name: '$warning30', code: colors.warning30, description: 'Contrasted warning color' },
      { name: '$warning30', code: colors.warning20, description: 'Main warning color' },
      { name: '$warning30', code: colors.warning10, description: 'Soft warning color' },
    ],
  },
  {
    familyName: 'Error',
    colors: [
      { name: '$error30', code: colors.error30, description: 'Contrasted error color' },
      { name: '$error30', code: colors.error20, description: 'Main error color' },
      { name: '$error30', code: colors.error10, description: 'Soft error color' },
    ],
  },
  {
    familyName: 'Overlay',
    colors: [
      { name: '$foreground30at48Percent', code: colors.foreground30at48Percent, description: 'Overlays, Drawers' },
      { name: '$foreground30at32Percent', code: colors.foreground30at32Percent, description: 'Details, Overlays' },
      { name: '$foreground30at12Percent', code: colors.foreground30at12Percent, description: 'Details' },
    ],
  },
  {
    familyName: 'Gradient',
    colors: [
      { name: '$foreground30Top', code: colors.foreground30, description: 'Overlays, Drawers', cssClass: 'gradient-top' },
      { name: '$foreground30Bottom', code: colors.foreground30, description: 'Details, Overlays', cssClass: 'gradient-bottom' },
    ],
  },
]

const ColorBlock: React.VFC<{ name: string; code: string; description: string; cssClass: string }> = ({
  name,
  code,
  description,
  cssClass,
}) => {
  const isGradient = cssClass?.toLowerCase().includes('gradient')

  return (
    <div className={`color-item ${cssClass} ${isGradient && 'warning'}`}>
      <div className="color-block" style={{ backgroundColor: code }} />
      <p className="color-name">{name}</p>
      <p className="color-code">{isGradient ? 'Use LinearGradient component!' : code}</p>
      <p className="color-description">{description}</p>
    </div>
  )
}

export default {
  title: 'Foundation/Colors',
  parameters: {
    docs: {
      description: {
        component: 'Holi Colors',
      },
    },
  },
}

export const ColorsOverview = () => {
  return (
    <div className="colors-overview">
      {allColors.map((familiy) => (
        <div key={familiy.familyName}>
          <h3>{familiy.familyName}</h3>
          <div className="color-familiy">
            {familiy.colors.map((color) => (
              <ColorBlock
                key={color.name}
                name={color.name}
                code={color.code}
                description={color.description}
                cssClass={color.cssClass}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
ColorsOverview.args = {}
ColorsOverview.argTypes = {}
