import { useState } from 'react';

import './App.css';
import mediq from './images/mediq.png';

function App() {
  const [loginType, setLoginType] = useState('');
  const [adminUsername, setAdminUsername] = useState();
  const [adminPassword, setAdminPassword] = useState();
  const [userCode, setUserCode] = useState();

  const handleUserLogin = () => {
    if (userCode == '123') {
      fetch(`http://localhost:8000/api/patients/${userCode}`, {
        method: "GET",
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data);
        })
        .catch(error => console.error('Error:', error));
      //window.location.href = "pages/user.html";
    } else {
      alert("User does not exist");
    }
  }

  const handleAdminLogin = () => {
    if (adminUsername == 'admin' && adminPassword == 'admin') {
      fetch(`http://localhost:8000/api/admin/queues`, {
        method: "GET",
        mode: "cors",
        headers: {
          'Authorization': 'Basic ' + btoa(unescape(encodeURIComponent(adminUsername + ':' + adminPassword))),
          'Content-Type': 'application/json',
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data);
        })
        .catch(error => console.error('Error:', error));
    } else {
      alert("Incorrect credentials. Please try again.");
    }
  }

  return (
    <div className="App">
      <div className="center">
        {loginType === '' && (
          <div className="login" id="initial_login">
            <img src={mediq} />
            <h2>Welcome!</h2>
            <p>Select login type</p>
            <button type="button" onClick={() => setLoginType('user')}>User</button>
            <button type="button" onClick={() => setLoginType('admin')}>Admin</button>
          </div>
        )}

        {loginType === 'user' && (
          <div className="login" id="user_login">
            <img src={mediq} />
            <h2>Welcome, User!</h2>
            <p>Please log in</p>
            <input type="text" placeholder="User Code" id="user_code" onChange={e => setUserCode(e.target.value)} />
            <button type="button" onClick={handleUserLogin}>Log In</button>
          </div>
        )}

        {loginType === 'admin' && (
          <div className="login" id="admin_login">
            <img src={mediq} />
            <h2>Welcome, Admin!</h2>
            <p>Please log in</p>
            <input type="text" placeholder="User Name" id="username" onChange={e => setAdminUsername(e.target.value)} />
            <input type="password" placeholder="Password" id="password" onChange={e => setAdminPassword(e.target.value)} />
            <button type="button" onClick={handleAdminLogin}>Log In</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
