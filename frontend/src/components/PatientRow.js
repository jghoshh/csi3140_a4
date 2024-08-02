import { CgProfile } from "react-icons/cg";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

import { Severity } from "./Severity";
import { Button } from "./Button";
import './component_styles.css';

// Component for displaying patient data
export function PatientRow({ patient }) {
    const navigate = useNavigate();
    const admin_key = localStorage.getItem('admin_key');

    // Handles admitting a patient (remove from queue)
    const admitPatient = () => {
        fetch(`http://localhost:8000/api/patients/admit/${patient.code}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                'Authorization': 'Basic ' + admin_key,
                'Content-Type': 'application/json',
            },
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
                        'critical': -20,
                        'high': -15,
                        'medium': -10,
                        'low': -5
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
    }

    return (
        <div className="row">
            <div className="cell" style={{ width: '50px' }}>
                <CgProfile size={35} style={{ paddingTop: '7px' }} />
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <div className="cell" style={{ width: '10%' }}><b>Code: </b>{patient.code}</div>
                <div className="cell" style={{ width: '30%' }}><b>Name: </b>{patient.name}</div>
                <div className="cell" style={{ width: '20%' }}><Severity severity={patient.severity} textSize={14} /></div>
                <div className="cell" style={{ width: '25%' }}><b>Wait time: </b>{patient.estimated_wait_time} minutes</div>
            </div>
            <div style={{ width: '15%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                <FaRegCircleCheck style={{ marginRight: '10px', cursor: 'pointer' }} size={30} color="green" onClick={admitPatient} />
            </div>
        </div>
    )
}