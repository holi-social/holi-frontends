import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowRightUp = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#arrow-right-up_svg__a)">
      <Path fill="currentColor" d="m16.005 9.414-8.607 8.607-1.414-1.414L14.59 8H7.005V6h11v11h-2z" />
    </G>
    <Defs>
      <ClipPath id="arrow-right-up_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowRightUp
