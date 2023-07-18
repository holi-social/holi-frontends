import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgUserAddFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#user-add-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M14 14.252V22H4a8 8 0 0 1 10-7.748ZM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6Zm6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3Z"
      />
    </G>
    <Defs>
      <ClipPath id="user-add-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgUserAddFilled
