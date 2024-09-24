import { useState } from 'react'
import './App.css'

import { Button } from 'popoyoko-ui'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Popoyoko app</h1>
      <Button action={() => setCount(count +1)}>Add {count}</Button>
      <Button><a href="https://github.com/Popoyoko/popoyoko-ui">Documentation</a></Button>
    </>
  )
}

export default App
