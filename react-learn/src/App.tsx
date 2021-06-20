import React, { useState } from 'react'
import LifeCycle from './Component/LifeCycle';
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <LifeCycle />
    </div>
  )
}

export default App
