import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SignUpPage from '@pages/SignUpPage';
import SignInPage from '@pages/SignInPage';
import ApplicationPage from '@pages/ApplicationPage';
import ProtectedRoute from '@hooks/protectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/application" element={<ApplicationPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
