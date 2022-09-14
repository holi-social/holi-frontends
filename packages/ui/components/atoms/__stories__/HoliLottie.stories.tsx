import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliLottie from '@holi/ui/components/atoms/HoliLottie.web'
import { animations } from '@holi/ui/lottie-animations'

export default {
  title: 'Atoms/HoliLottie',
  parameters: {
    docs: {
      description: {
        component: 'HoliLottie - Lottie animation component.',
      },
    },
  },
} as ComponentMeta<typeof HoliLottie>

export const Primary: ComponentStory<typeof HoliLottie> = ({ animType }: { animType: keyof typeof animations }) => (
  <HoliLottie animType={animType} />
)

Primary.args = {
  animType: 'loader',
}
Primary.argTypes = {
  animType: {
    description: `Animation type: ${Object.keys(animations)
      .map((key) => `"${key}"`)
      .join(' | ')}`,
    // control: { type: 'text', options: Object.keys(animations) },
  },
}

// export const All = () => {
//   const [filteredIcons, setFilteredIcons] = useState(iconSelection.icons)

//   const filter = (event) => {
//     const iconList = iconSelection.icons || []
//     const filterString = event.target.value
//     if (!filterString || filterString.length <= 3) {
//       setFilteredIcons(iconList)
//     }
//     const filteredItems = iconList.filter((icon) => icon?.properties?.name?.indexOf(filterString) >= 0)
//     setFilteredIcons(filteredItems)
//   }

//   return (
//     <div className="svg-preview">
//       <label>
//         Filter:
//         <input type="text" onChange={filter} />
//       </label>
//       <div className="icons">
//         {filteredIcons.map((icon, index) => (
//           <div key={index} className="icon-container">
//             <a>
//               <HoliIcon icon={icon?.properties?.name} size={32} />
//             </a>
//             <div>{icon?.properties?.name}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
// All.args = {
//   color: colors.fontColorBlack,
// }
// All.argTypes = {
//   color: { control: { type: 'color' } },
// }
