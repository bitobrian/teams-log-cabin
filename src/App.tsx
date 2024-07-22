import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { app } from '@microsoft/teams-js';

function App() {
  const [count, setCount] = useState(0)
    const [userId, setUserId] = useState('')
    const [insideTeams, setInsideTeams] = useState(false)

    useEffect(() => {
        app.initialize().then(function () {
            app.getContext().then(function (context) {
                const userName = context.user?.id || '';

                setUserId(userName);
                setInsideTeams(true);
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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
            <h2>Teams Context</h2>
            <div style={{display: "flex", flexDirection: "column", alignItems: 'start'}}>
                <p>Inside Teams: {insideTeams ? '✅' : '❌'} </p>
                <p>User ID: <code>{userId}</code></p>
            </div>
        </div>
    </>
  )
}

export default App
