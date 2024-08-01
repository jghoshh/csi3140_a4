import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import './styles.css'
import { AdminNavbar } from "../components/AdminNavbar";
import { PatientRow } from "../components/PatientRow";

export function AdminPage() {
    let { auth } = useParams();

    // Define state
    const [patients, setPatients] = useState();

    useEffect(() => {
        // Get queue data on first render
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
                // Set state to data if no errors occur
                if (!data.error) {
                    setPatients(data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <AdminNavbar />
            <div className="container">
                {/* Render patient data if state is set */}
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
                    <div>Invalid Authorization.</div>
                }
            </div>
        </>
    );
}