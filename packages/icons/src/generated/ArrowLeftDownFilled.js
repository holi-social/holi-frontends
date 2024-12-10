import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgArrowLeftDownFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#arrow-left-down-filled_svg__a)">
      <Path fill="currentColor" d="m12.358 13.05 4.95 4.95H5.996V6.688l4.95 4.95 5.656-5.657 1.415 1.414z" />
    </G>
    <Defs>
      <ClipPath id="arrow-left-down-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgArrowLeftDownFilled
