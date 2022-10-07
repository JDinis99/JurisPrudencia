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
            <Route path="/" element={<ImportPage />}/>
            <Route path="/anom" element={<Anom />}/>
            <Route path="/ajuda" element={<HelpPage />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;