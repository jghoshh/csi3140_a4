import { CgProfile } from "react-icons/cg";

import { Severity } from "./Severity";
import './component_styles.css';

export function PatientRow({ patient }) {
    return (
        <div className="row">
            <div className="cell" style={{ width: '50px' }}>
                <CgProfile size={35} style={{ paddingTop: '7px' }} />
            </div>
            <div className="cell" style={{ width: '10%' }}><b>Code: </b>{patient.code}</div>
            <div className="cell" style={{ width: '20%' }}><b>Name: </b>{patient.name}</div>
            <div className="cell" style={{ width: '15%' }}><Severity severity={patient.severity} textSize={14} /></div>
            <div className="cell" style={{ width: '15%' }}><b>Wait time: </b>{patient.estimated_wait_time} minutes</div>
        </div>
    )
}