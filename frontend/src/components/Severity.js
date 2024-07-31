import { IoWarningOutline } from "react-icons/io5";

import './component_styles.css';

export function Severity({ severity, textSize }) {
    return (
        <div
            style={{
                fontSize: `${textSize}px`,
                color: 'white',
                backgroundColor: severity == 'low' ? 'green' : severity == 'medium' ? '#bd631e' : 'red',
                borderRadius: '20px',
                padding: `${textSize - 10}px`,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: `${textSize - 3}px`,
                height: `${textSize * 2}px`
            }}
        >
            <IoWarningOutline style={{ marginRight: '5px' }} size={30} /> <p><b>Severity: {severity}</b></p>
        </div>
    );
}