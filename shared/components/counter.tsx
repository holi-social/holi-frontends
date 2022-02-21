import React, { useState } from 'react'
import Holicon from "../holicon"

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);

  return (
    <div>
      <p>You clicked {count} times</p>
      <Holicon icon="person" size={20} color="#0f0" />
      <button onClick={incrementCount}>Click Me</button>
    </div>
  )
}

export default Counter;
