import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgHandHeartFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#hand-heart-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M9.33 11.5h2.17A4.5 4.5 0 0 1 16 16H8.999L9 17h8v-1a5.6 5.6 0 0 0-.886-3H19a5 5 0 0 1 4.516 2.851c-2.365 3.121-6.194 5.15-10.516 5.15-2.761 0-5.1-.59-7-1.626v-9.304a6.97 6.97 0 0 1 3.33 1.43M4 9a1 1 0 0 1 .993.883L5 10v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm9.646-5.425L14 3.93l.354-.354a2.5 2.5 0 1 1 3.535 3.536L14 11l-3.89-3.89a2.5 2.5 0 1 1 3.536-3.535"
      />
    </G>
    <Defs>
      <ClipPath id="hand-heart-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgHandHeartFilled
