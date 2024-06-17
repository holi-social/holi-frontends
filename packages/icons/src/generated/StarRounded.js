import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgStarRounded = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 32 31" {...props}>
    <Path
      fill="currentColor"
      d="m18.867 2.383 2.22 4.5a3.198 3.198 0 0 0 2.409 1.749l4.965.722a3.198 3.198 0 0 1 1.773 5.454l-3.593 3.502a3.199 3.199 0 0 0-.92 2.83l.848 4.947a3.198 3.198 0 0 1-4.64 3.371l-4.441-2.334a3.196 3.196 0 0 0-2.976 0l-4.442 2.334a3.198 3.198 0 0 1-4.64-3.371l.849-4.946a3.198 3.198 0 0 0-.92-2.83l-3.593-3.502a3.198 3.198 0 0 1 1.773-5.455l4.965-.721a3.198 3.198 0 0 0 2.409-1.75l2.218-4.5a3.198 3.198 0 0 1 5.736 0Z"
    />
  </Svg>
)
export default SvgStarRounded
