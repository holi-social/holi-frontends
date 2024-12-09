import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowDownFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#arrow-down-filled_svg__a)">
      <Path fill="currentColor" d="M13 12h7l-8 8-8-8h7V4h2z" />
    </G>
    <Defs>
      <ClipPath id="arrow-down-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowDownFilled
