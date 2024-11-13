import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SkincareQuestionnaire from './components/Questionnaire';
import HomePage from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route 
            path="/questionnaire" 
            element={
              <ProtectedRoute>
                <SkincareQuestionnaire />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
