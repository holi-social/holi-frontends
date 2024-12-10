import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowDown = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#arrow-down_svg__a)">
      <Path fill="currentColor" d="m13 16.172 5.365-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2z" />
    </G>
    <Defs>
      <ClipPath id="arrow-down_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowDown
