import React, { useState } from 'react'
import LifeCycle from './Component/LifeCycle';
import logo from './logo.svg'
import './App.css'


let currentListeners: any = [];
let nextListeners = currentListeners;

function ensureCanMutateNextListeners() {

  console.log(currentListeners, nextListeners, nextListeners === currentListeners);
  
  if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
  }
}

function subscribe(listener: () => void) {
  ensureCanMutateNextListeners();
  nextListeners.push(listener);
}


subscribe(() => {console.log('a')});

subscribe(() => {console.log('b')});


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <LifeCycle />
    </div>
  )
}

export default App
