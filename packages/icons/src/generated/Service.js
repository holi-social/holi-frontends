import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgService = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="M3.162 4.47a6.5 6.5 0 0 1 8.84-.329 6.5 6.5 0 0 1 9.178 9.154l-7.765 7.79a2 2 0 0 1-2.719.102l-.11-.1-7.764-7.792a6.5 6.5 0 0 1 .34-8.826m1.414 1.413a4.5 4.5 0 0 0-.146 6.21l.146.154 7.425 7.425 5.303-5.304-3.535-3.535-1.06 1.06A3.001 3.001 0 0 1 8.465 7.65l2.102-2.103a4.5 4.5 0 0 0-5.837.19zm8.486 2.828a1 1 0 0 1 1.414 0l4.242 4.242.708-.706a4.5 4.5 0 0 0-6.211-6.51l-.153.146L9.88 9.065a1 1 0 0 0-.078 1.327l.078.087a1 1 0 0 0 1.327.078l.087-.078z"
    />
  </Svg>
)
export default SvgService
