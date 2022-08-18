import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Anom from './Anom';
import ImportPage from './ImportPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route exact path="/" element={<ImportPage />}/>
            <Route exact path="/Anom" element={<Anom />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;