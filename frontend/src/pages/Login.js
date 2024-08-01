import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import mediq from '../images/mediq.png';

export function Login() {
    const navigate = useNavigate();

    // Define state
    const [loginType, setLoginType] = useState('');
    const [adminUsername, setAdminUsername] = useState();
    const [adminPassword, setAdminPassword] = useState();
    const [userCode, setUserCode] = useState();

    // Handles login as user
    const handleUserLogin = () => {
        // Fetch with inputted usercode to check if valid
        fetch(`http://localhost:8000/api/patients/${userCode}`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    navigate({ pathname: "/user/" + userCode })
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Handles login as admin
    const handleAdminLogin = () => {
        // Set encoded authorization
        const encoded_info = btoa(unescape(encodeURIComponent(adminUsername + ':' + adminPassword)));

        // Fetch with admin auth to check if valid
        fetch(`http://localhost:8000/api/admin/queues`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Basic ' + encoded_info,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Incorrect credentials.")
                } else {
                    localStorage.setItem('admin_key', encoded_info);
                    // reset info
                    setAdminUsername();
                    setAdminPassword();

                    // navigate to admin page
                    navigate({ pathname: "/admin/" + encoded_info })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div>
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
};