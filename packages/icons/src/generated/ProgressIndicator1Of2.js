import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgProgressIndicator1Of2 = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill="#45B2E0"
      stroke="#45B2E0"
      strokeLinecap="round"
      d="M10 3.413c0-.405.328-.736.73-.696a7.32 7.32 0 0 1 1.789 14.157c-.38.14-.78-.1-.88-.492-.101-.391.137-.786.513-.935A5.857 5.857 0 0 0 10.73 4.19c-.401-.05-.73-.373-.73-.777Z"
    />
    <Path
      fill="#90DDFF"
      d="M10 16.588c0 .404-.329.736-.73.696A7.321 7.321 0 0 1 7.48 3.127c.38-.14.781.1.882.492.1.391-.138.786-.514.934A5.856 5.856 0 0 0 9.27 15.811c.401.05.73.373.73.777"
    />
  </Svg>
)
export default SvgProgressIndicator1Of2
