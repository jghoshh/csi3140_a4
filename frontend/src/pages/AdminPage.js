import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import './styles.css'

import { PatientRow } from "../components/PatientRow";

export function AdminPage() {
    let { auth } = useParams();

    const navigate = useNavigate;
    const [patients, setPatients] = useState();

    useEffect(() => {
        console.log(auth);
        fetch(`http://localhost:8000/api/admin/queues`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': 'Basic ' + auth,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                if (data.error) {
                    navigate({ pathname: "/" });
                } else {
                    setPatients(data);
                    console.log(patients.severity_queue);
                }
            })
            .catch(error => {

            });
    }, []);

    return (
        <div className="container">
            {patients ?
                <>
                    <h1>Patients</h1>
                    <div className="patient_table">
                        {patients.severity_queue.map((patient, i) =>
                            <PatientRow key={i} patient={patient} />
                        )}
                    </div>
                </>
                :
                <div>Invalid Autorization.</div>
            }
        </div>
    );
}