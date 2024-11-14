import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowLeftSFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-left-s-filled_svg__a)">
      <Path fill="currentColor" d="m8 12 6-6v12z" />
    </G>
    <Defs>
      <ClipPath id="arrow-left-s-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowLeftSFilled
