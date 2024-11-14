import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowRightUpFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-right-up-filled_svg__a)">
      <Path fill="currentColor" d="m13.05 12.36-5.656 5.658-1.414-1.415 5.657-5.656-4.95-4.95H18V17.31z" />
    </G>
    <Defs>
      <ClipPath id="arrow-right-up-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowRightUpFilled
