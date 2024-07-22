import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { app } from '@microsoft/teams-js';

function App() {
  const [count, setCount] = useState(0)
    const [hostname, setHostname] = useState('')

    useEffect(() => {
        app.initialize().then(function () {
            app.getContext().then(function (context) {
                if (context?.app?.host?.name) {
                    setHostname(context?.app?.host?.name)
                }
            });
        });

    }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Host name in teams is: {hostname} : if that was blank, it isn't in teams
      </p>
        <p>See if the env name worked: {import.meta.env.APP_NAME}</p>
    </>
  )
}

export default App
