import { RiHome2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

import './component_styles.css';
import { Button } from "./Button";

// Admin navbar component
export function AdminNavbar() {
    const navigate = useNavigate();

    // Handles adding a patient through prompt inputs
    const addPatient = () => {
        const severity_options = ["low", "medium", "high", "critical"]
        const name = prompt("Enter patient name");
        const severity = prompt("Enter seveity (low/medium/high/critical): ");
        const wait_time = prompt("Enter wait time (in minutes): ");
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
                    navigate(0);
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert("Invalid values.");
        }
    }

    return (
        <div className='header'>
            <Button text='Home' buttonIcon='home' backgroundColor='#204877' textColor='white' action={() => navigate("/")} />
            <Button text='Add Patient' buttonIcon='add' backgroundColor='#239643' textColor='white' action={addPatient} />
        </div>
    )
}