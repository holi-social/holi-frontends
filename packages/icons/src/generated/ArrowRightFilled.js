import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowRightFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-right-filled_svg__a)">
      <Path fill="currentColor" d="M12 13H4v-2h8V4l8 8-8 8z" />
    </G>
    <Defs>
      <ClipPath id="arrow-right-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowRightFilled
