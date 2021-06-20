import React, { useState, useEffect } from 'react';

function Son() {
  console.log('child render!');

  useEffect(() => {
    console.log('child render1!');
  }, [])
  return <div>Son</div>;
}


function Parent({ children }: any) {
  const [count, setCount] = useState(0);

  console.log('parent render!');

  useEffect(() => {
    console.log('parent render1!');
  }, [])

  return (
    <div onClick={() => {setCount(count + 1)}}>
      Parent
      count:{count}
      {children}
    </div>
  );
}


export default function LifeCycle() {
  return (
    <Parent>
      <Son/>
    </Parent>
  );
}