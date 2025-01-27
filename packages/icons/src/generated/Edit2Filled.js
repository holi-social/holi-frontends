import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgEdit2Filled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#edit-2-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M9.243 19H21v2H3v-4.243l9.9-9.9 4.242 4.244zm5.07-13.556 2.122-2.122a1 1 0 0 1 1.414 0l2.829 2.83a1 1 0 0 1 0 1.413l-2.122 2.121z"
      />
    </G>
    <Defs>
      <ClipPath id="edit-2-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgEdit2Filled
