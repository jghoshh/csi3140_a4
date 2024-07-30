import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './styles.css'
import { Severity } from "../components/Severity";
import { UserNavbar } from "../components/UserNavbar";

export function UserPage() {
    let { userId } = useParams();

    const navigate = useNavigate;
    const [patientInfo, setPatientInfo] = useState();

    useEffect(() => {
        fetch(`http://localhost:8000/api/patients/info/` + userId, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Basic ' + userId,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPatientInfo(data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <UserNavbar />
            <div className="container">
                <h1>Welcome, {patientInfo?.name}</h1>
                <div style={{ width: '40', height: '40%', marginBottom: '40px' }}>
                    <CircularProgressbar
                        value={((180 - patientInfo?.wait_time) / 180) * 100}
                        text={`${patientInfo?.wait_time} minutes`}
                        styles={buildStyles({
                            textSize: '12px',
                            textColor: '#204877',
                            pathColor: '#204877',
                        })}
                    />
                </div>
                <Severity severity={patientInfo?.severity} textSize={20} />
                <br />
                <div>Arrival time: {patientInfo?.arrival_time}</div>
            </div>
        </>
    );
}