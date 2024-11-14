import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgOpenArmFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#open-arm-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M12.002 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10m6 5v5h-2v-5c0-4.451 2.644-8.285 6.447-10.016l.828 1.82A9 9 0 0 0 18.002 17m-10 0v5h-2v-5A9 9 0 0 0 .727 8.805l.828-1.821A11 11 0 0 1 8.002 17"
      />
    </G>
    <Defs>
      <ClipPath id="open-arm-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgOpenArmFilled
