import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgGroup = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#group_svg__a)">
      <Path
        fill="currentColor"
        d="M2 22a8 8 0 0 1 16 0h-2a6 6 0 1 0-12 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m8.284 3.703A8 8 0 0 1 23 22h-2a6 6 0 0 0-3.537-5.473zm-.688-11.29a5.5 5.5 0 0 1 1.967 8.796A5.5 5.5 0 0 1 16 13.978v-2.013a3.5 3.5 0 0 0 1.041-6.609z"
      />
    </G>
    <Defs>
      <ClipPath id="group_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgGroup
