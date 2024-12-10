import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowRightDown = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#arrow-right-down_svg__a)">
      <Path fill="currentColor" d="M14.589 16.004 5.98 7.397l1.414-1.414 8.608 8.606V7.004h2v11h-11v-2z" />
    </G>
    <Defs>
      <ClipPath id="arrow-right-down_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowRightDown
