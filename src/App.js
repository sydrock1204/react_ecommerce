import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage'; 
import Bookings from './pages/Bookings'; 
import Parcs from './pages/Parcs';
 
import logo from './logo.svg';
import './App.css';

const App = () => {
  return (

      // <div>
      //   <h1>Hello world!</h1>
      // </div>
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/parcs">Parcs</Link>
            </li>
            <li>
              <Link to="/bookings">Bookings</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/parcs" element={<Parcs />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
