import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowLeftUp = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-left-up_svg__a)">
      <Path fill="currentColor" d="m9.414 8 8.607 8.607-1.414 1.414L8 9.414V17H6V6h11v2z" />
    </G>
    <Defs>
      <ClipPath id="arrow-left-up_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowLeftUp
