import React from 'react';
import './App.css';
import Routing from './Routing/Routing';

function App() {
  return (
    <>
      <div className="app-content">
        <Routing />
      </div>
      <div className="small-screen-message">
        <span>Please use a larger device for a better experience.</span>
      </div>
    </>
  );
}

export default App;
