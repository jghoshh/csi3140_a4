import { Routes, Route } from 'react-router-dom';

import { Login } from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path="admin" element={<AdminPage />} />
      <Route path="user" element={<UserPage />} />
    </Routes>
  );
}

function AdminPage() {
  return (
    <div>
      <p>This is the admin page.</p>
    </div>
  );
}

function UserPage() {
  return (
    <div>
      <p>This is the user page.</p>
    </div>
  );
}