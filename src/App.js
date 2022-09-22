import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Anom from './Anom';
import ImportPage from './ImportPage';
import HelpPage from './HelpPage';
import Header from './components/header';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Header/>
          <Routes>
            <Route exact path="/anon" element={<ImportPage />}/>
            <Route exact path="/anon/anom" element={<Anom />}/>
            <Route exact path="/anon/ajuda" element={<HelpPage />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;