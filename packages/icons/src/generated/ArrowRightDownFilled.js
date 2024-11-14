import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowRightDownFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-right-down-filled_svg__a)">
      <Path fill="currentColor" d="M11.638 13.05 5.98 7.395 7.394 5.98l5.658 5.657L18 6.687V18H6.687z" />
    </G>
    <Defs>
      <ClipPath id="arrow-right-down-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowRightDownFilled
