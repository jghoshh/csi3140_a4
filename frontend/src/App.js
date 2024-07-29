import { Routes, Route } from 'react-router-dom';

import { Login } from './pages/Login';
import { AdminPage } from './pages/AdminPage';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="admin/:auth" element={<AdminPage />} />
        <Route path="user/:userId" element={<UserPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function UserPage() {
  return (
    <div>
      <p>This is the user page.</p>
    </div>
  );
}