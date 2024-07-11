import React from 'react';
import './App.css';
import routes from './routes/routes';
import { useRoutes } from 'react-router-dom'

function App() {
  const allRoutes = useRoutes(routes)

  return (
    <>
    <script src="https://apis.google.com/js/api.js" type="text/javascript"></script>
    <div className="App">
      {allRoutes}
    </div>
    </>
  );
}

export default App;
