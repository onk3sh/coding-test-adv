import './App.css';
import Carousel from './components/Carousel';
import Categories from './components/Categories';
import React from 'react';

function App() {
  const [activeCat, setActiveCat] = React.useState([]);

  return (
    <div className="app">
      <header className="app-header">
        <Categories setActiveCat={setActiveCat} activeCat={activeCat} />
        <Carousel categories={activeCat} />
      </header>
    </div>
  );
}

export default App;