import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgNewspaperFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#newspaper-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M19 22H5a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h4v9a3 3 0 0 1-3 3Zm-1-10v7a1 1 0 0 0 2 0v-7h-2ZM5 6v6h6V6H5Zm0 7v2h10v-2H5Zm0 3v2h10v-2H5Zm2-8h2v2H7V8Z"
      />
    </G>
    <Defs>
      <ClipPath id="newspaper-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgNewspaperFilled
