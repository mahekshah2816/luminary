import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SkincareQuestionnaire from './components/Questionnaire';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SkincareQuestionnaire />} />
        
      </Routes>
    </Router>
  );
}

export default App;
