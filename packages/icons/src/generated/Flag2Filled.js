import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgFlag2Filled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#flag-2-filled_svg__a)">
      <Path fill="currentColor" d="M2 3h19.138a.5.5 0 0 1 .435.748L18 10l3.573 6.252a.499.499 0 0 1-.435.748H4v5H2z" />
    </G>
    <Defs>
      <ClipPath id="flag-2-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgFlag2Filled
