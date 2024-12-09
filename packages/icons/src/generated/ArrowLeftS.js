import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowLeftS = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#arrow-left-s_svg__a)">
      <Path fill="currentColor" d="m10.828 12 4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
    </G>
    <Defs>
      <ClipPath id="arrow-left-s_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowLeftS
