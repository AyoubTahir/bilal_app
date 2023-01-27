import { Routes, Route } from 'react-router-dom';

import Regiser from './pages/auth/Register';
import Login from './pages/auth/Login';
import NotFound from './pages/errors/NotFound';
import Home from './pages/home/Home';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import ForgotPassword from './pages/auth/forgotPassword';
import UpdatePassword from './pages/auth/UpdatePassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Regiser />} />
      <Route path="/login" element={<Login />} />
      <Route path="/confirm-email/:id/:token" element={<EmailConfirmation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password/:id/:token" element={<UpdatePassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
