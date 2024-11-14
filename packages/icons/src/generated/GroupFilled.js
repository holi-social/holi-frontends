import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgGroupFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#group-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M2 22a8 8 0 0 1 16 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6m7.363 2.233A7.5 7.5 0 0 1 22.983 22H20c0-2.61-1-4.986-2.637-6.767m-2.023-2.276A7.98 7.98 0 0 0 18 7a7.96 7.96 0 0 0-1.015-3.903 5 5 0 0 1-1.645 9.86"
      />
    </G>
    <Defs>
      <ClipPath id="group-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgGroupFilled
