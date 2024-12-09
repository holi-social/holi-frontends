import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgWallet3 = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#wallet-3_svg__a)">
      <Path
        fill="currentColor"
        d="M22 7h1v10h-1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1zm-2 10h-6a5 5 0 1 1 0-10h6V5H4v14h16zm1-2V9h-7a3 3 0 0 0 0 6zm-7-4h3v2h-3z"
      />
    </G>
    <Defs>
      <ClipPath id="wallet-3_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgWallet3
