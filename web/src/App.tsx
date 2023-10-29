import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const useEcho = () => {
  const [data, setData] = useState<unknown>();
  useEffect(() => {
    (async () => {
      const resp = await fetch("/api/echo/foobar");
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    })();
  }, []);

  return { data };
};

function App() {
  const [count, setCount] = useState(0);
  const { data } = useEcho();

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
      <pre
        style={{
          textAlign: "left",
        }}
      >
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
