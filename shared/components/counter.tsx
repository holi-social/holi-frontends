import React, { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const incrementCount = () => setCount(count + 1);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={incrementCount}>Click Me</button>
    </div>
  )
}

export default Counter;
