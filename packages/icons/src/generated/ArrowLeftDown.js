import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowLeftDown = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#arrow-left-down_svg__a)">
      <Path fill="currentColor" d="m9 13.59 8.607-8.607 1.414 1.414-8.607 8.607H18v2H7v-11h2v7.585" />
    </G>
    <Defs>
      <ClipPath id="arrow-left-down_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowLeftDown
