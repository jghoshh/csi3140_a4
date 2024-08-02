import { RiHome2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

import './component_styles.css';
import { Button } from "./Button";

// Admin navbar component
export function AdminNavbar() {
    const navigate = useNavigate();
    const admin_key = localStorage.getItem('admin_key');

    // Handles adding a patient through prompt inputs
    const addPatient = () => {
        let name, severity, wait_time = null;
        const severity_options = ["low", "medium", "high", "critical"]
        name = prompt("Enter patient name");
        if (name != null) {
            severity = prompt("Enter seveity (low/medium/high/critical): ");
        }
        if (severity != null) {
            wait_time = prompt("Enter wait time (in minutes): ");
        }
        if (name != null && severity != null && wait_time != null) {
            if (severity_options.includes(severity) && !isNaN(parseFloat(wait_time))) {
                fetch(`http://localhost:8000/api/patients`, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name, severity: severity, wait_time: wait_time })
                })
                    .then(response => response.json())
                    .then(data => {
                        fetch(`http://localhost:8000/api/admin/wait-times`, {
                            method: "PUT",
                            mode: "cors",
                            headers: {
                                'Authorization': 'Basic ' + admin_key,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                'critical': 5,
                                'high': 10,
                                'medium': 15,
                                'low': 20
                            }),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                navigate(0);
                            })
                            .catch(error => console.error('Error:', error));
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                alert("Invalid values.");
            }
        }
    }

    return (
        <div className='header'>
            <Button text='Home' buttonIcon='home' backgroundColor='#204877' textColor='white' action={() => navigate("/")} />
            <Button text='Add Patient' buttonIcon='add' backgroundColor='#239643' textColor='white' action={addPatient} />
        </div>
    )
}