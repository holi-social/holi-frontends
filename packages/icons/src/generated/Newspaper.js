import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgNewspaper = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#newspaper_svg__a)">
      <Path
        fill="currentColor"
        d="M16 20V4H4v15a1 1 0 0 0 1 1zm3 2H5a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7h4v9a3 3 0 0 1-3 3m-1-10v7a1 1 0 0 0 2 0v-7zM6 6h6v6H6zm2 2v2h2V8zm-2 5h8v2H6zm0 3h8v2H6z"
      />
    </G>
    <Defs>
      <ClipPath id="newspaper_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgNewspaper
