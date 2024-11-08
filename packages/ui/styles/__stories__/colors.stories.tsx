import React from 'react'

import { colors } from '@holi/ui/styles/globalVars'

interface Color {
  name: string
  code?: string
  description: string
  cssClass?: string
}
interface ColorFamily {
  familyName: string
  colors: Color[]
  isGradient?: boolean
}

const allColors: ColorFamily[] = [
  {
    familyName: 'Black',
    colors: [{ name: '$black300', code: colors.black300, description: 'Headline, links, button borders' }],
  },
  {
    familyName: 'Gray',
    colors: [
      {
        name: '$gray300',
        code: colors.gray300,
        description: 'Support text, body',
      },
      { name: '$gray200', code: colors.gray200, description: 'Disabled text, details' },
      { name: '$gray100', code: colors.gray100, description: 'Background details like input borders, button borders' },
    ],
  },
  {
    familyName: 'White',
    colors: [
      {
        name: '$white200',
        code: colors.white200,
        description: 'Large containers: pages, main divs',
      },
      { name: '$white100', code: colors.white100, description: 'Small areas: buttons, pills, tags, cells' },
    ],
  },
  {
    familyName: 'Brand A',
    colors: [
      { name: '$brandA300', code: colors.brandA300, description: 'Contrasted yellow' },
      { name: '$brandA200', code: colors.brandA200, description: 'Main yellow, CTAs, buttons' },
      { name: '$brandA100', code: colors.brandA100, description: 'Soft yellow' },
    ],
  },
  {
    familyName: 'Brand B',
    colors: [
      { name: '$brandB300', code: colors.brandB300, description: 'Contrasted purple' },
      { name: '$brandB200', code: colors.brandB200, description: 'Main purple, actions' },
      { name: '$brandB100', code: colors.brandB100, description: 'Soft purple' },
    ],
  },
  {
    familyName: 'Brand C',
    colors: [
      { name: '$brandC300', code: colors.brandC300, description: 'Contrasted green' },
      { name: '$brandC200', code: colors.brandC200, description: 'Main green, pills' },
      { name: '$brandC100', code: colors.brandC100, description: 'Soft green' },
    ],
  },
  {
    familyName: 'Brand D',
    colors: [
      { name: '$brandD300', code: colors.brandD300, description: 'Contrasted blue' },
      { name: '$brandD200', code: colors.brandD200, description: 'Main blue, pills' },
      { name: '$brandD100', code: colors.brandD100, description: 'Soft blue' },
    ],
  },
  {
    familyName: 'Warning',
    colors: [
      { name: '$warning300', code: colors.warning300, description: 'Contrasted warning color' },
      { name: '$warning200', code: colors.warning200, description: 'Main warning color' },
      { name: '$warning100', code: colors.warning100, description: 'Background' },
    ],
  },
  {
    familyName: 'Error',
    colors: [
      { name: '$error300', code: colors.error300, description: 'Contrasted error color' },
      { name: '$error200', code: colors.error200, description: 'Main error color' },
      { name: '$error100', code: colors.error100, description: 'Background' },
    ],
  },
  {
    familyName: 'Overlay',
    colors: [
      { name: '$black300at48percent', code: colors.black300at48percent, description: 'Details' },
      { name: '$black300at32percent', code: colors.black300at32percent, description: 'Overlays and drawers' },
      { name: '$black300at12percent', code: colors.black300at12percent, description: 'Details' },
    ],
  },
  {
    familyName: 'Gradient',
    isGradient: true,
    colors: [
      {
        name: '$black300Top',
        description: 'Headers',
        cssClass: 'gradient-black300Top',
      },
      {
        name: '$black300Bottom',
        description: 'Footers',
        cssClass: 'gradient-black300Bottom',
      },
    ],
  },
]

const ColorBlock = ({ name, code, description, cssClass, isGradient = false }: Color & { isGradient?: boolean }) => {
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
  title: 'Foundations/Legacy Colors',
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
          <div className="color-family">
            {familiy.colors.map((color) => (
              <ColorBlock
                key={color.name}
                name={color.name}
                code={color.code}
                description={color.description}
                cssClass={color.cssClass}
                isGradient={familiy.isGradient}
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
