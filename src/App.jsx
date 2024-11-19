import React from 'react';
import './App.css';
import Evaluation from './components/Evaluation';
import DarkModeToggle from './components/DarkModeToggle'; 


const App = () => {
  return (
    <div className="App">
      <header className="flex justify-end p-4">
      </header>
      <Evaluation />
    </div>
  );
};

export default App;
