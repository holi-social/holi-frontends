import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgUserSettings = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#user-settings_svg__a)">
      <Path
        fill="currentColor"
        d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8m0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m2.595 7.812a3.5 3.5 0 0 1 0-1.623l-.992-.573 1-1.732.992.573c.398-.377.88-.655 1.405-.812V13.5h2v1.145c.532.158 1.012.44 1.405.812l.992-.573 1 1.732-.992.573a3.5 3.5 0 0 1 0 1.622l.992.573-1 1.732-.992-.573c-.398.377-.88.655-1.405.812V22.5h-2v-1.145a3.5 3.5 0 0 1-1.405-.812l-.992.573-1-1.732zM18 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
      />
    </G>
    <Defs>
      <ClipPath id="user-settings_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgUserSettings
