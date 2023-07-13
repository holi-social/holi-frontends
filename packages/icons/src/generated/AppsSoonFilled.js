import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgAppsSoonFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#apps-soon-filled_svg__a)">
      <Path
        fill="currentColor"
        fillRule="evenodd"
        d="M17.998 2a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h12Zm-6 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM11 12V7h2v7H7v-2h4Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="apps-soon-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgAppsSoonFilled
