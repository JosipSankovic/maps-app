import { useState } from 'react'
import './App.css'
import CustomMap from './mapComponents/CustomMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
    
    <CustomMap />
    </div>
  )
}

export default App
