import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgZzzFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#zzz-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M11 11v2l-5.327 6H11v2H3v-2l5.326-6H3v-2zm10-8v2l-5.327 6H21v2h-8v-2l5.326-6H13V3z"
      />
    </G>
    <Defs>
      <ClipPath id="zzz-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgZzzFilled
