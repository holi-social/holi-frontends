import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowUp = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-up_svg__a)">
      <Path fill="currentColor" d="M13 7.828V20h-2V7.828l-5.363 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414z" />
    </G>
    <Defs>
      <ClipPath id="arrow-up_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowUp
