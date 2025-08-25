import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgChallenges = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G fill="currentColor" clipPath="url(#challenges_svg__a)">
      <Path
        fillRule="evenodd"
        d="M11.999 4.044 9.625 7.517a3 3 0 0 1-1.632 1.186L3.957 9.887l2.569 3.33a3 3 0 0 1 .624 1.92l-.121 4.204 3.96-1.415a3 3 0 0 1 2.018 0l3.961 1.415-.12-4.205a3 3 0 0 1 .623-1.918l2.57-3.33-4.037-1.185a3 3 0 0 1-1.632-1.186zm9.446 6.255h-.002zm-8.62-8.591a1 1 0 0 0-1.652 0l-3.199 4.68a1 1 0 0 1-.544.396L1.99 8.38a1 1 0 0 0-.51 1.57l3.463 4.49a1 1 0 0 1 .207.639l-.162 5.667a1 1 0 0 0 1.335.97l5.34-1.906a1 1 0 0 1 .672 0l5.339 1.906a1 1 0 0 0 1.336-.97l-.163-5.667a1 1 0 0 1 .208-.64l3.463-4.489a1 1 0 0 0-.51-1.57l-5.44-1.597a1 1 0 0 1-.545-.395z"
        clipRule="evenodd"
      />
      <Path d="M12 15.363c1.79 0 3.283-1.262 3.616-2.934H8.385C8.718 14.1 10.21 15.363 12 15.363" />
    </G>
    <Defs>
      <ClipPath id="challenges_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgChallenges
