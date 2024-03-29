import {useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import syncosaurusLogo from './assets/DarkBlueLogo.png'
import './App.css'

import Syncosaurus from 'syncosaurus'
import {useSubscribe} from 'syncosaurus'
import mutators from './mutators.js'
import Cursors from './components/cursors.jsx'


const synco = new Syncosaurus({mutators, userID: String(Math.random()), server: 'ws://localhost:8787'})

function App() {
  const count = useSubscribe(synco, (tx) => tx.get('count'), 0)

  useEffect(() => {
    synco.launch('foo')
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    synco.mutate.increment({key: 'count', delta: 1})
  }

  return (
    <>
      <Cursors synco={synco} />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://github.com/syncosaurus/syncosaurus" target="_blank">
          <img src={syncosaurusLogo} className='logo' alt="Syncosaurus logo" />
        </a>
      </div>
      <h1>Vite + React + Syncosaurus</h1>
      <div className="card">
        <button onClick={handleClick}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite, React, and Syncosaurus logos to learn more</p>
    </>
  )
}

export default App
