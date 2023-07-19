import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgContactsFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#contacts-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M2 22a8 8 0 0 1 16 0H2Zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6Zm10 4h4v2h-4v-2Zm-3-5h7v2h-7v-2Zm2-5h5v2h-5V7Z"
      />
    </G>
    <Defs>
      <ClipPath id="contacts-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgContactsFilled
